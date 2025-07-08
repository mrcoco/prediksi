import os
import json
import hashlib
from typing import Optional, Any, Dict
from redis import Redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
import logging

logger = logging.getLogger(__name__)

# Redis Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

# Cache Configuration
CACHE_EXPIRE_PREDICTIONS = int(os.getenv("CACHE_EXPIRE_PREDICTIONS", 1800))  # 30 minutes
CACHE_EXPIRE_MODEL_DATA = int(os.getenv("CACHE_EXPIRE_MODEL_DATA", 3600))   # 1 hour
CACHE_EXPIRE_STUDENT_DATA = int(os.getenv("CACHE_EXPIRE_STUDENT_DATA", 900))  # 15 minutes

# Redis Client Instance
redis_client: Optional[Redis] = None


def init_cache():
    """Initialize Redis cache connection"""
    global redis_client
    try:
        redis_client = Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            password=REDIS_PASSWORD,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
            health_check_interval=30
        )
        
        # Test connection
        redis_client.ping()
        
        # Initialize FastAPI Cache
        FastAPICache.init(RedisBackend(redis_client), prefix="edupro-cache")
        
        logger.info(f"✅ Redis cache initialized successfully at {REDIS_HOST}:{REDIS_PORT}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize Redis cache: {str(e)}")
        redis_client = None
        return False


def get_cache_client() -> Optional[Redis]:
    """Get Redis client instance"""
    return redis_client


def create_cache_key(prefix: str, **kwargs) -> str:
    """Create a standardized cache key from parameters"""
    # Sort kwargs for consistent key generation
    sorted_params = sorted(kwargs.items())
    param_string = "&".join([f"{k}={v}" for k, v in sorted_params])
    
    # Create hash for long keys
    if len(param_string) > 200:
        param_hash = hashlib.md5(param_string.encode()).hexdigest()
        return f"{prefix}:hash:{param_hash}"
    
    return f"{prefix}:{param_string}"


def set_cache(key: str, value: Any, expire: int = CACHE_EXPIRE_PREDICTIONS) -> bool:
    """Set cache value with expiration"""
    if not redis_client:
        return False
    
    try:
        # Serialize value to JSON
        serialized_value = json.dumps(value, ensure_ascii=False, separators=(',', ':'))
        
        # Set with expiration
        result = redis_client.setex(key, expire, serialized_value)
        
        if result:
            logger.debug(f"📦 Cache SET: {key} (expires in {expire}s)")
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Cache SET error for key {key}: {str(e)}")
        return False


def get_cache(key: str) -> Optional[Any]:
    """Get cache value"""
    if not redis_client:
        return None
    
    try:
        cached_value = redis_client.get(key)
        
        if cached_value is None:
            logger.debug(f"🔍 Cache MISS: {key}")
            return None
        
        # Deserialize from JSON
        value = json.loads(cached_value)
        logger.debug(f"🎯 Cache HIT: {key}")
        
        return value
        
    except Exception as e:
        logger.error(f"❌ Cache GET error for key {key}: {str(e)}")
        return None


def delete_cache(key: str) -> bool:
    """Delete cache value"""
    if not redis_client:
        return False
    
    try:
        result = redis_client.delete(key)
        if result:
            logger.debug(f"🗑️ Cache DELETE: {key}")
        return bool(result)
        
    except Exception as e:
        logger.error(f"❌ Cache DELETE error for key {key}: {str(e)}")
        return False


def delete_cache_pattern(pattern: str) -> int:
    """Delete all cache keys matching pattern"""
    if not redis_client:
        return 0
    
    try:
        keys = redis_client.keys(pattern)
        if keys:
            result = redis_client.delete(*keys)
            logger.info(f"🗑️ Cache DELETE pattern {pattern}: {result} keys deleted")
            return result
        return 0
        
    except Exception as e:
        logger.error(f"❌ Cache DELETE pattern error for {pattern}: {str(e)}")
        return 0


def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics"""
    if not redis_client:
        return {"status": "disconnected"}
    
    try:
        info = redis_client.info()
        return {
            "status": "connected",
            "connected_clients": info.get("connected_clients", 0),
            "used_memory": info.get("used_memory_human", "0B"),
            "total_connections_received": info.get("total_connections_received", 0),
            "total_commands_processed": info.get("total_commands_processed", 0),
            "keyspace_hits": info.get("keyspace_hits", 0),
            "keyspace_misses": info.get("keyspace_misses", 0),
            "hit_rate": round(
                info.get("keyspace_hits", 0) / 
                max(info.get("keyspace_hits", 0) + info.get("keyspace_misses", 0), 1) * 100, 
                2
            )
        }
        
    except Exception as e:
        logger.error(f"❌ Cache stats error: {str(e)}")
        return {"status": "error", "error": str(e)}


def invalidate_student_cache(siswa_id: int, semester: str = None, tahun_ajaran: str = None):
    """Invalidate cache for specific student"""
    patterns = [
        f"predict:siswa_id={siswa_id}*",
        f"student_data:siswa_id={siswa_id}*"
    ]
    
    if semester and tahun_ajaran:
        patterns.extend([
            f"predict:siswa_id={siswa_id}&semester={semester}&tahun_ajaran={tahun_ajaran}*",
            f"student_data:siswa_id={siswa_id}&semester={semester}&tahun_ajaran={tahun_ajaran}*"
        ])
    
    total_deleted = 0
    for pattern in patterns:
        total_deleted += delete_cache_pattern(pattern)
    
    logger.info(f"🔄 Invalidated {total_deleted} cache entries for student {siswa_id}")
    return total_deleted


def cache_health_check() -> bool:
    """Check if cache is healthy"""
    if not redis_client:
        return False
    
    try:
        redis_client.ping()
        return True
    except Exception:
        return False 