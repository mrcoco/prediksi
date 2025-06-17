--
-- PostgreSQL database dump
--

-- Dumped from database version 13.20 (Debian 13.20-1.pgdg120+1)
-- Dumped by pg_dump version 13.20 (Debian 13.20-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: nilai_raport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nilai_raport (
    id integer NOT NULL,
    siswa_id integer,
    semester character varying,
    tahun_ajaran character varying,
    matematika double precision,
    bahasa_indonesia double precision,
    bahasa_inggris double precision,
    ipa double precision,
    bahasa_jawa double precision,
    rata_rata double precision,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    agama double precision,
    pkn double precision,
    sejarah double precision,
    seni double precision,
    pjok double precision,
    dasar_kejuruan double precision
);


ALTER TABLE public.nilai_raport OWNER TO postgres;

--
-- Name: nilai_raport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nilai_raport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nilai_raport_id_seq OWNER TO postgres;

--
-- Name: nilai_raport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nilai_raport_id_seq OWNED BY public.nilai_raport.id;


--
-- Name: penghasilan_ortu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penghasilan_ortu (
    id integer NOT NULL,
    siswa_id integer,
    penghasilan_ayah double precision,
    penghasilan_ibu double precision,
    pekerjaan_ayah character varying,
    pekerjaan_ibu character varying,
    pendidikan_ayah character varying,
    pendidikan_ibu character varying,
    total_penghasilan double precision,
    kategori_penghasilan character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.penghasilan_ortu OWNER TO postgres;

--
-- Name: penghasilan_ortu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.penghasilan_ortu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.penghasilan_ortu_id_seq OWNER TO postgres;

--
-- Name: penghasilan_ortu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.penghasilan_ortu_id_seq OWNED BY public.penghasilan_ortu.id;


--
-- Name: presensi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presensi (
    id integer NOT NULL,
    siswa_id integer,
    semester character varying,
    tahun_ajaran character varying,
    jumlah_hadir integer,
    jumlah_sakit integer,
    jumlah_izin integer,
    jumlah_alpa integer,
    persentase_kehadiran double precision,
    kategori_kehadiran character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.presensi OWNER TO postgres;

--
-- Name: presensi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.presensi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.presensi_id_seq OWNER TO postgres;

--
-- Name: presensi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.presensi_id_seq OWNED BY public.presensi.id;


--
-- Name: prestasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestasi (
    id integer NOT NULL,
    siswa_id integer,
    semester character varying,
    tahun_ajaran character varying,
    prediksi_prestasi character varying,
    confidence double precision,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.prestasi OWNER TO postgres;

--
-- Name: prestasi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prestasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prestasi_id_seq OWNER TO postgres;

--
-- Name: prestasi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prestasi_id_seq OWNED BY public.prestasi.id;


--
-- Name: siswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.siswa (
    id integer NOT NULL,
    nama character varying,
    nis character varying,
    jenis_kelamin character varying,
    kelas character varying,
    tanggal_lahir timestamp without time zone,
    alamat text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.siswa OWNER TO postgres;

--
-- Name: siswa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.siswa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.siswa_id_seq OWNER TO postgres;

--
-- Name: siswa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.siswa_id_seq OWNED BY public.siswa.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255),
    hashed_password character varying(255),
    profile json,
    role character varying(20),
    is_active boolean,
    email character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: nilai_raport id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nilai_raport ALTER COLUMN id SET DEFAULT nextval('public.nilai_raport_id_seq'::regclass);


--
-- Name: penghasilan_ortu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penghasilan_ortu ALTER COLUMN id SET DEFAULT nextval('public.penghasilan_ortu_id_seq'::regclass);


--
-- Name: presensi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presensi ALTER COLUMN id SET DEFAULT nextval('public.presensi_id_seq'::regclass);


--
-- Name: prestasi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestasi ALTER COLUMN id SET DEFAULT nextval('public.prestasi_id_seq'::regclass);


--
-- Name: siswa id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siswa ALTER COLUMN id SET DEFAULT nextval('public.siswa_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: nilai_raport; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.nilai_raport VALUES (323, 10, 'Ganjil', '2023/2024', 96, 94, 94, 96, 87, 92.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 97, 96, 88, 87, 94, 92);
INSERT INTO public.nilai_raport VALUES (324, 11, 'Ganjil', '2023/2024', 92, 99, 98, 99, 98, 94.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 99, 89, 90, 90, 97);
INSERT INTO public.nilai_raport VALUES (325, 12, 'Ganjil', '2023/2024', 87, 87, 86, 90, 89, 90.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 95, 94, 92, 87, 94, 93);
INSERT INTO public.nilai_raport VALUES (326, 13, 'Ganjil', '2023/2024', 90, 91, 93, 98, 95, 92.55, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 91, 94, 90, 96, 90, 90);
INSERT INTO public.nilai_raport VALUES (327, 14, 'Ganjil', '2023/2024', 95, 94, 99, 89, 91, 93, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 96, 89, 91, 90, 95, 94);
INSERT INTO public.nilai_raport VALUES (328, 15, 'Ganjil', '2023/2024', 94, 99, 97, 93, 96, 94.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 93, 91, 98, 99, 90, 91);
INSERT INTO public.nilai_raport VALUES (329, 16, 'Ganjil', '2023/2024', 93, 92, 98, 92, 88, 91.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 90, 90, 88, 97, 93);
INSERT INTO public.nilai_raport VALUES (330, 17, 'Ganjil', '2023/2024', 90, 81, 84, 86, 91, 85.55, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 84, 87, 89, 83, 83, 83);
INSERT INTO public.nilai_raport VALUES (331, 18, 'Ganjil', '2023/2024', 90, 97, 90, 90, 96, 94, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 96, 99, 97, 97, 92);
INSERT INTO public.nilai_raport VALUES (332, 19, 'Ganjil', '2023/2024', 83, 84, 88, 84, 91, 85.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 85, 84, 83, 91, 83, 84);
INSERT INTO public.nilai_raport VALUES (333, 20, 'Ganjil', '2023/2024', 93, 87, 92, 87, 91, 90.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 93, 92, 92, 92, 90, 90);
INSERT INTO public.nilai_raport VALUES (334, 21, 'Ganjil', '2023/2024', 88, 85, 94, 94, 95, 90.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 93, 90, 86, 92, 93, 90);
INSERT INTO public.nilai_raport VALUES (335, 22, 'Ganjil', '2023/2024', 92, 94, 89, 97, 93, 93.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 97, 92, 95, 93, 91, 98);
INSERT INTO public.nilai_raport VALUES (336, 23, 'Ganjil', '2023/2024', 94, 92, 92, 96, 89, 91.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 93, 92, 92, 95, 88, 88);
INSERT INTO public.nilai_raport VALUES (337, 24, 'Ganjil', '2023/2024', 89, 89, 92, 86, 93, 89.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 93, 91, 84, 86, 92);
INSERT INTO public.nilai_raport VALUES (338, 25, 'Ganjil', '2023/2024', 83, 85, 84, 84, 87, 86, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 84, 90, 85, 85, 90, 89);
INSERT INTO public.nilai_raport VALUES (339, 26, 'Ganjil', '2023/2024', 89, 87, 82, 82, 88, 85.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 84, 89, 83, 88, 89, 82);
INSERT INTO public.nilai_raport VALUES (340, 27, 'Ganjil', '2023/2024', 94, 92, 88, 95, 88, 92.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 88, 95, 91, 92, 96, 96);
INSERT INTO public.nilai_raport VALUES (341, 28, 'Ganjil', '2023/2024', 99, 92, 92, 96, 91, 94.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 96, 94, 99, 89, 96, 98);
INSERT INTO public.nilai_raport VALUES (342, 29, 'Ganjil', '2023/2024', 95, 95, 92, 94, 89, 92.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 93, 92, 87, 92, 90, 96);
INSERT INTO public.nilai_raport VALUES (343, 30, 'Ganjil', '2023/2024', 98, 88, 97, 96, 94, 93, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 91, 90, 91, 97, 92, 89);
INSERT INTO public.nilai_raport VALUES (344, 31, 'Ganjil', '2023/2024', 87, 88, 89, 94, 94, 90.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 94, 89, 90, 91, 96, 88);
INSERT INTO public.nilai_raport VALUES (345, 32, 'Ganjil', '2023/2024', 87, 87, 90, 87, 86, 88.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 86, 93, 89, 92, 86, 93);
INSERT INTO public.nilai_raport VALUES (346, 33, 'Ganjil', '2023/2024', 97, 89, 92, 93, 99, 94.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 97, 96, 99, 98, 94);
INSERT INTO public.nilai_raport VALUES (347, 34, 'Ganjil', '2023/2024', 93, 91, 92, 88, 96, 92.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 98, 91, 96, 93, 91, 91);
INSERT INTO public.nilai_raport VALUES (348, 35, 'Ganjil', '2023/2024', 86, 86, 82, 89, 89, 85.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 82, 83, 90, 84, 87);
INSERT INTO public.nilai_raport VALUES (349, 36, 'Ganjil', '2023/2024', 89, 85, 83, 91, 86, 86.55, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 82, 88, 83, 88, 90);
INSERT INTO public.nilai_raport VALUES (350, 37, 'Ganjil', '2023/2024', 98, 94, 89, 98, 94, 94.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 98, 90, 95, 98, 92, 96);
INSERT INTO public.nilai_raport VALUES (351, 38, 'Ganjil', '2023/2024', 87, 84, 86, 83, 84, 85.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 88, 85, 90, 81, 87, 87);
INSERT INTO public.nilai_raport VALUES (352, 39, 'Ganjil', '2023/2024', 85, 86, 83, 81, 83, 83.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 83, 86, 84, 81, 87, 83);
INSERT INTO public.nilai_raport VALUES (353, 40, 'Ganjil', '2023/2024', 90, 83, 82, 83, 92, 88.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 89, 89, 92, 92, 88, 89);
INSERT INTO public.nilai_raport VALUES (354, 41, 'Ganjil', '2023/2024', 88, 90, 81, 87, 85, 86.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 89, 80, 88, 88, 86, 89);
INSERT INTO public.nilai_raport VALUES (355, 42, 'Ganjil', '2023/2024', 94, 92, 88, 90, 90, 90.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 94, 87, 89, 92, 87, 91);
INSERT INTO public.nilai_raport VALUES (356, 43, 'Ganjil', '2023/2024', 83, 86, 87, 86, 86, 86.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 90, 88, 83, 80, 88);
INSERT INTO public.nilai_raport VALUES (357, 44, 'Ganjil', '2023/2024', 93, 90, 88, 86, 93, 91.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 92, 95, 90, 94, 91, 94);
INSERT INTO public.nilai_raport VALUES (358, 45, 'Ganjil', '2023/2024', 86, 87, 90, 88, 88, 88.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 92, 90, 90, 88, 94, 85);
INSERT INTO public.nilai_raport VALUES (359, 46, 'Ganjil', '2023/2024', 95, 96, 87, 93, 94, 91.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 86, 90, 87, 88, 91, 95);
INSERT INTO public.nilai_raport VALUES (360, 47, 'Ganjil', '2023/2024', 97, 92, 96, 97, 89, 93.18, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 91, 96, 89, 95, 87, 96);
INSERT INTO public.nilai_raport VALUES (361, 48, 'Ganjil', '2023/2024', 89, 80, 83, 80, 83, 84.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 81, 87, 88, 89, 89, 84);
INSERT INTO public.nilai_raport VALUES (362, 49, 'Ganjil', '2023/2024', 90, 82, 80, 90, 84, 84.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 80, 83, 80, 83, 85, 90);
INSERT INTO public.nilai_raport VALUES (363, 50, 'Ganjil', '2023/2024', 97, 94, 99, 90, 91, 93.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 94, 94, 91, 99, 89, 90);
INSERT INTO public.nilai_raport VALUES (364, 51, 'Ganjil', '2023/2024', 81, 81, 80, 85, 88, 84.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 80, 90, 81, 88, 86, 88);
INSERT INTO public.nilai_raport VALUES (365, 52, 'Ganjil', '2023/2024', 94, 96, 89, 95, 89, 92.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 96, 95, 92, 90, 89, 91);
INSERT INTO public.nilai_raport VALUES (366, 53, 'Ganjil', '2023/2024', 82, 88, 88, 87, 82, 86.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 86, 86, 89, 87, 91, 88);
INSERT INTO public.nilai_raport VALUES (314, 101, 'Ganjil', '2023/2024', 86, 95, 94, 91, 91, 91.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 95, 95, 89, 91, 88, 90);
INSERT INTO public.nilai_raport VALUES (315, 2, 'Ganjil', '2023/2024', 90, 89, 89, 93, 90, 92.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 97, 93, 98, 96, 98, 88);
INSERT INTO public.nilai_raport VALUES (316, 3, 'Ganjil', '2023/2024', 85, 80, 86, 81, 89, 85.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 82, 89, 88, 90, 83, 89);
INSERT INTO public.nilai_raport VALUES (318, 5, 'Ganjil', '2023/2024', 86, 87, 87, 84, 91, 87.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 88, 87, 88, 84, 92, 88);
INSERT INTO public.nilai_raport VALUES (319, 6, 'Ganjil', '2023/2024', 83, 88, 80, 88, 80, 84.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 82, 84, 84, 85, 87, 86);
INSERT INTO public.nilai_raport VALUES (320, 7, 'Ganjil', '2023/2024', 82, 81, 89, 88, 82, 85.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 85, 88, 86, 90, 83, 89);
INSERT INTO public.nilai_raport VALUES (321, 8, 'Ganjil', '2023/2024', 86, 82, 89, 90, 82, 84.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 88, 83, 81, 84, 80, 89);
INSERT INTO public.nilai_raport VALUES (322, 9, 'Ganjil', '2023/2024', 88, 89, 85, 92, 84, 88.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 84, 94, 85, 90, 93);
INSERT INTO public.nilai_raport VALUES (380, 67, 'Ganjil', '2023/2024', 84, 88, 84, 92, 94, 87.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 84, 84, 85, 88, 90, 89);
INSERT INTO public.nilai_raport VALUES (381, 68, 'Ganjil', '2023/2024', 99, 92, 99, 93, 93, 96, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 99, 99, 99, 93, 96, 94);
INSERT INTO public.nilai_raport VALUES (382, 69, 'Ganjil', '2023/2024', 92, 96, 96, 91, 88, 93, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 94, 91, 88, 96, 93, 98);
INSERT INTO public.nilai_raport VALUES (383, 70, 'Ganjil', '2023/2024', 96, 88, 89, 90, 93, 92.18, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 88, 96, 96, 91, 93, 94);
INSERT INTO public.nilai_raport VALUES (384, 71, 'Ganjil', '2023/2024', 93, 97, 96, 91, 92, 93.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 99, 98, 90, 95, 89);
INSERT INTO public.nilai_raport VALUES (385, 72, 'Ganjil', '2023/2024', 90, 87, 83, 82, 86, 84.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 84, 84, 89, 84, 81, 84);
INSERT INTO public.nilai_raport VALUES (386, 73, 'Ganjil', '2023/2024', 97, 97, 100, 99, 98, 96.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 96, 95, 100, 94, 90, 100);
INSERT INTO public.nilai_raport VALUES (387, 74, 'Ganjil', '2023/2024', 88, 81, 84, 89, 82, 86.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 89, 87, 87, 89, 89, 89);
INSERT INTO public.nilai_raport VALUES (388, 75, 'Ganjil', '2023/2024', 88, 90, 96, 94, 87, 91.18, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 96, 93, 91, 88, 92, 88);
INSERT INTO public.nilai_raport VALUES (389, 76, 'Ganjil', '2023/2024', 71, 76, 74, 67, 70, 70.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 75, 70, 69, 71, 67, 69);
INSERT INTO public.nilai_raport VALUES (390, 77, 'Ganjil', '2023/2024', 72, 77, 77, 71, 74, 75, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 78, 74, 71, 77, 78, 76);
INSERT INTO public.nilai_raport VALUES (391, 78, 'Ganjil', '2023/2024', 73, 82, 80, 83, 82, 79.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 81, 77, 77, 75, 78, 82);
INSERT INTO public.nilai_raport VALUES (392, 79, 'Ganjil', '2023/2024', 81, 75, 74, 79, 81, 79, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 78, 75, 83, 81, 84, 78);
INSERT INTO public.nilai_raport VALUES (393, 80, 'Ganjil', '2023/2024', 74, 78, 77, 78, 76, 74.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 70, 72, 78, 71, 74, 76);
INSERT INTO public.nilai_raport VALUES (394, 81, 'Ganjil', '2023/2024', 75, 74, 76, 76, 78, 77.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 76, 78, 82, 79, 77, 80);
INSERT INTO public.nilai_raport VALUES (395, 82, 'Ganjil', '2023/2024', 76, 78, 70, 77, 71, 75.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 72, 78, 77, 74, 76, 80);
INSERT INTO public.nilai_raport VALUES (396, 83, 'Ganjil', '2023/2024', 74, 82, 83, 77, 73, 77.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 78, 76, 79, 76, 76, 83);
INSERT INTO public.nilai_raport VALUES (397, 84, 'Ganjil', '2023/2024', 79, 70, 74, 72, 79, 72.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 71, 69, 71, 72, 72, 70);
INSERT INTO public.nilai_raport VALUES (398, 85, 'Ganjil', '2023/2024', 72, 68, 71, 77, 74, 72.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 68, 76, 77, 77, 68, 68);
INSERT INTO public.nilai_raport VALUES (399, 86, 'Ganjil', '2023/2024', 81, 73, 79, 77, 74, 77.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 81, 81, 81, 76, 75, 73);
INSERT INTO public.nilai_raport VALUES (400, 87, 'Ganjil', '2023/2024', 79, 80, 74, 81, 73, 76.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 81, 71, 79, 75, 76, 77);
INSERT INTO public.nilai_raport VALUES (401, 88, 'Ganjil', '2023/2024', 77, 77, 76, 80, 79, 77.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 80, 78, 75, 84, 74, 75);
INSERT INTO public.nilai_raport VALUES (402, 89, 'Ganjil', '2023/2024', 79, 79, 75, 82, 78, 78.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 81, 77, 76, 76, 77, 85);
INSERT INTO public.nilai_raport VALUES (403, 90, 'Ganjil', '2023/2024', 71, 70, 71, 79, 77, 75.18, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 79, 72, 74, 79, 78, 77);
INSERT INTO public.nilai_raport VALUES (404, 91, 'Ganjil', '2023/2024', 71, 71, 79, 73, 77, 74.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 73, 73, 76, 77, 80, 71);
INSERT INTO public.nilai_raport VALUES (405, 92, 'Ganjil', '2023/2024', 69, 75, 75, 79, 75, 74.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 77, 74, 75, 79, 69, 71);
INSERT INTO public.nilai_raport VALUES (406, 93, 'Ganjil', '2023/2024', 78, 79, 77, 69, 72, 75.18, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 77, 79, 76, 79, 70, 71);
INSERT INTO public.nilai_raport VALUES (407, 94, 'Ganjil', '2023/2024', 68, 76, 67, 73, 77, 73.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 71, 75, 70, 76, 76, 75);
INSERT INTO public.nilai_raport VALUES (408, 95, 'Ganjil', '2023/2024', 81, 73, 81, 76, 79, 78.45, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 75, 82, 80, 76, 81, 79);
INSERT INTO public.nilai_raport VALUES (409, 96, 'Ganjil', '2023/2024', 70, 63, 63, 64, 64, 66.55, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 69, 68, 63, 65, 73, 70);
INSERT INTO public.nilai_raport VALUES (410, 97, 'Ganjil', '2023/2024', 64, 58, 58, 61, 58, 59.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 59, 61, 59, 59, 63, 58);
INSERT INTO public.nilai_raport VALUES (411, 98, 'Ganjil', '2023/2024', 64, 64, 67, 64, 59, 63.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 62, 61, 65, 66, 59, 65);
INSERT INTO public.nilai_raport VALUES (412, 99, 'Ganjil', '2023/2024', 66, 66, 57, 62, 57, 63.27, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 66, 65, 66, 62, 66, 63);
INSERT INTO public.nilai_raport VALUES (317, 4, 'Ganjil', '2023/2024', 81, 80, 90, 86, 90, 85.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 84, 88, 90, 84, 82, 81);
INSERT INTO public.nilai_raport VALUES (367, 54, 'Ganjil', '2023/2024', 86, 89, 86, 91, 83, 86.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 91, 84, 85, 90, 88, 82);
INSERT INTO public.nilai_raport VALUES (368, 55, 'Ganjil', '2023/2024', 88, 91, 89, 94, 88, 90.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 86, 93, 93, 94, 86, 95);
INSERT INTO public.nilai_raport VALUES (369, 56, 'Ganjil', '2023/2024', 96, 95, 97, 92, 91, 94, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 91, 93, 98, 99, 91, 91);
INSERT INTO public.nilai_raport VALUES (377, 64, 'Ganjil', '2023/2024', 88, 91, 81, 83, 89, 86.09, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 86, 86, 87, 85, 81, 90);
INSERT INTO public.nilai_raport VALUES (378, 65, 'Ganjil', '2023/2024', 87, 91, 86, 88, 86, 88.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 93, 84, 92, 88, 94);
INSERT INTO public.nilai_raport VALUES (379, 66, 'Ganjil', '2023/2024', 89, 93, 90, 92, 85, 88.55, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 87, 86, 86, 92, 87);
INSERT INTO public.nilai_raport VALUES (413, 100, 'Ganjil', '2023/2024', 71, 61, 62, 67, 69, 65.91, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 66, 62, 66, 71, 61, 69);
INSERT INTO public.nilai_raport VALUES (370, 57, 'Ganjil', '2023/2024', 92, 92, 97, 92, 89, 92.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 90, 96, 91, 89, 96, 96);
INSERT INTO public.nilai_raport VALUES (371, 58, 'Ganjil', '2023/2024', 91, 84, 84, 86, 90, 86.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 87, 85, 88, 83, 91, 84);
INSERT INTO public.nilai_raport VALUES (372, 59, 'Ganjil', '2023/2024', 89, 90, 90, 89, 91, 90.64, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 91, 89, 89, 89, 92, 98);
INSERT INTO public.nilai_raport VALUES (373, 60, 'Ganjil', '2023/2024', 88, 89, 93, 94, 89, 90, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 96, 91, 89, 88, 86, 87);
INSERT INTO public.nilai_raport VALUES (374, 61, 'Ganjil', '2023/2024', 84, 85, 85, 89, 83, 85.82, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 89, 90, 81, 84, 91, 83);
INSERT INTO public.nilai_raport VALUES (375, 62, 'Ganjil', '2023/2024', 89, 98, 97, 95, 96, 93.73, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 93, 92, 96, 90, 95, 90);
INSERT INTO public.nilai_raport VALUES (376, 63, 'Ganjil', '2023/2024', 92, 83, 90, 88, 88, 87.36, '2025-06-15 09:27:19.129101', '2025-06-15 12:20:11.725983', 83, 84, 92, 83, 89, 89);


--
-- Data for Name: penghasilan_ortu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.penghasilan_ortu VALUES (87, 6, 6147360, 6361623, 'Insinyur', 'Perawat', 'S3', 'S3', 12508983, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (88, 7, 8817929, 7438186, 'Manager', 'Manager', 'D4', 'S1', 16256115, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (89, 8, 6712867, 7429063, 'Direktur', 'Dosen', 'S1', 'S1', 14141930, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (90, 9, 7334455, 5298649, 'Direktur', 'Dokter', 'S3', 'S3', 12633104, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (91, 10, 6576198, 4165881, 'Dosen', 'Perawat', 'S1', 'S1', 10742079, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (92, 11, 10695271, 7771713, 'Dosen', 'Teknisi', 'S2', 'SMK', 18466984, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (93, 12, 8939129, 5862191, 'Insinyur', 'Direktur', 'D4', 'S1', 14801320, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (94, 13, 6316997, 4508781, 'Dosen', 'Direktur', 'S1', 'S1', 10825778, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (158, 77, 5970048, 3237065, 'Polisi', 'Guru', 'SMA', 'SMP', 9207113, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (159, 78, 3911541, 2571477, 'Perawat', 'Polisi', 'D3', 'SD', 6483018, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (160, 79, 5224624, 3308898, 'Teknisi', 'TNI', 'D3', 'SD', 8533522, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (161, 80, 3564707, 3708085, 'Pedagang', 'Guru', 'SMA', 'D3', 7272792, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (82, 101, 9178360, 5333419, 'Dosen', 'PNS Golongan III', 'D4', 'D4', 14511779, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (83, 2, 10953289, 6336840, 'Direktur', 'Polisi', 'S3', 'S2', 17290129, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (84, 3, 9352419, 5870952, 'Insinyur', 'Dokter', 'S1', 'S1', 15223371, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (85, 4, 9848900, 7494781, 'Direktur', 'Polisi', 'S1', 'S1', 17343681, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (86, 5, 8473287, 6789436, 'Dosen', 'Wiraswasta', 'S2', 'D4', 15262723, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (162, 81, 4536824, 3381151, 'Perawat', 'Polisi', 'D3', 'SMA', 7917975, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (163, 82, 3752897, 3043296, 'Karyawan Swasta', 'Polisi', 'SMA', 'SD', 6796193, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (164, 83, 4207740, 2084066, 'Polisi', 'Pedagang', 'SMK', 'SMP', 6291806, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (165, 84, 4270266, 3101815, 'Guru', 'TNI', 'SMA', 'D3', 7372081, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (166, 85, 4178874, 3955526, 'Perawat', 'Karyawan Swasta', 'SMK', 'SMP', 8134400, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (167, 86, 5272616, 3803263, 'Teknisi', 'Teknisi', 'SMK', 'SMK', 9075879, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (168, 87, 5078189, 2342580, 'Karyawan Swasta', 'Pedagang', 'SMA', 'SMK', 7420769, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (169, 88, 5782237, 3013572, 'Guru', 'Perawat', 'D3', 'D3', 8795809, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (170, 89, 5024230, 2983890, 'Pedagang', 'Polisi', 'SMK', 'D3', 8008120, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (172, 91, 3934818, 3502696, 'Pedagang', 'Teknisi', 'D3', 'SMK', 7437514, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (95, 14, 7825648, 6523387, 'Pengacara', 'TNI', 'S1', 'D3', 14349035, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (96, 15, 6993650, 5253835, 'Manager', 'Konsultan', 'D4', 'S3', 12247485, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (97, 16, 10173889, 4914555, 'Konsultan', 'Teknisi', 'S3', 'D3', 15088444, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (98, 17, 9151414, 7863412, 'Insinyur', 'Dokter', 'S2', 'SMA', 17014826, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (99, 18, 8781507, 4014317, 'PNS Golongan III', 'Pengacara', 'D4', 'D4', 12795824, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (100, 19, 11277465, 5080296, 'Manager', 'Pedagang', 'S1', 'S3', 16357761, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (101, 20, 6542382, 4784693, 'Insinyur', 'Perawat', 'S3', 'D4', 11327075, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (102, 21, 9163242, 4270810, 'Insinyur', 'Perawat', 'S3', 'S2', 13434052, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (103, 22, 8201533, 4949742, 'PNS Golongan III', 'Pedagang', 'D4', 'D3', 13151275, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (104, 23, 7019726, 5300657, 'Dosen', 'Guru', 'S2', 'SMK', 12320383, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (105, 24, 9274003, 6410950, 'PNS Golongan III', 'Guru', 'S3', 'SMA', 15684953, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (106, 25, 8042702, 7827754, 'Direktur', 'Dosen', 'S2', 'D4', 15870456, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (107, 26, 6736009, 6894264, 'Pengacara', 'Polisi', 'S3', 'S2', 13630273, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (108, 27, 7860040, 6957934, 'Pengacara', 'Wiraswasta', 'S2', 'D4', 14817974, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (109, 28, 7576699, 5208675, 'Direktur', 'Pedagang', 'S2', 'S2', 12785374, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (110, 29, 11317896, 4032699, 'Insinyur', 'Polisi', 'S1', 'S2', 15350595, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (111, 30, 10347413, 7579512, 'Pengacara', 'PNS Golongan III', 'S1', 'SMK', 17926925, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (112, 31, 6097920, 4345550, 'Insinyur', 'Dokter', 'S2', 'D3', 10443470, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (113, 32, 7635870, 6852814, 'Direktur', 'Pengacara', 'S3', 'SMK', 14488684, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (114, 33, 8466596, 5544492, 'Dosen', 'Direktur', 'S3', 'SMA', 14011088, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (115, 34, 11796451, 5132146, 'Pengacara', 'PNS Golongan III', 'S2', 'D3', 16928597, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (116, 35, 6590128, 7357787, 'PNS Golongan III', 'Pengacara', 'S2', 'D4', 13947915, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (117, 36, 9171964, 6839584, 'Insinyur', 'Perawat', 'S1', 'S3', 16011548, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (118, 37, 7916642, 7131637, 'Direktur', 'Dokter', 'S1', 'S2', 15048279, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (119, 38, 11408828, 7871408, 'Dokter', 'Wiraswasta', 'S3', 'D3', 19280236, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (120, 39, 11708933, 6979948, 'Pengacara', 'TNI', 'S2', 'SMK', 18688881, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (121, 40, 10488525, 4251365, 'Pengacara', 'Direktur', 'S1', 'D4', 14739890, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (122, 41, 7116927, 7722326, 'Dokter', 'Perawat', 'D4', 'S1', 14839253, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (123, 42, 6659009, 6072986, 'Konsultan', 'TNI', 'S2', 'S2', 12731995, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (124, 43, 10593490, 5468729, 'Konsultan', 'Pedagang', 'S2', 'D4', 16062219, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (125, 44, 7945233, 4345837, 'Konsultan', 'Perawat', 'D4', 'D4', 12291070, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (126, 45, 6611065, 7359203, 'Manager', 'Dosen', 'S3', 'S2', 13970268, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (127, 46, 7467805, 7469761, 'Dosen', 'PNS Golongan III', 'S1', 'S1', 14937566, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (128, 47, 9557978, 4220200, 'Direktur', 'Karyawan Swasta', 'S2', 'S1', 13778178, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (129, 48, 7404704, 6703538, 'Pengacara', 'Polisi', 'D4', 'D4', 14108242, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (130, 49, 8813168, 7769482, 'Pengacara', 'Teknisi', 'D4', 'S1', 16582650, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (131, 50, 11484977, 7394157, 'Konsultan', 'Dosen', 'S1', 'S2', 18879134, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (132, 51, 9963986, 4161386, 'Dokter', 'Wiraswasta', 'S1', 'SMA', 14125372, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (133, 52, 7970888, 6129950, 'Manager', 'Karyawan Swasta', 'S3', 'S3', 14100838, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (134, 53, 9358393, 6155661, 'Konsultan', 'Teknisi', 'S3', 'D4', 15514054, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (135, 54, 6243595, 5819358, 'Insinyur', 'Perawat', 'S2', 'D3', 12062953, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (136, 55, 7379344, 7521811, 'Insinyur', 'Dokter', 'S2', 'S1', 14901155, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (137, 56, 9873275, 4929456, 'Dosen', 'TNI', 'D4', 'SMK', 14802731, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (138, 57, 6290383, 6928317, 'Dosen', 'Karyawan Swasta', 'S3', 'S3', 13218700, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (139, 58, 10617769, 5422614, 'Manager', 'Wiraswasta', 'S3', 'D3', 16040383, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (140, 59, 9391138, 5806820, 'Dosen', 'Pengacara', 'S1', 'S2', 15197958, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (141, 60, 10656737, 4058555, 'Direktur', 'Perawat', 'S3', 'SMA', 14715292, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (142, 61, 10421128, 6464987, 'Pengacara', 'Pedagang', 'D4', 'S2', 16886115, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (143, 62, 10141415, 4875803, 'Manager', 'Insinyur', 'S2', 'D4', 15017218, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (144, 63, 8152293, 5570145, 'Manager', 'Pengacara', 'D4', 'D3', 13722438, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (145, 64, 9546104, 7977403, 'Dosen', 'Teknisi', 'S1', 'S3', 17523507, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (146, 65, 6309413, 4342050, 'Dosen', 'TNI', 'S1', 'SMA', 10651463, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (147, 66, 7773443, 4894769, 'PNS Golongan III', 'Manager', 'D4', 'S2', 12668212, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (148, 67, 8086308, 7105560, 'Dokter', 'Dosen', 'S3', 'S1', 15191868, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (149, 68, 10763001, 6805638, 'Insinyur', 'Perawat', 'S3', 'SMK', 17568639, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (150, 69, 8988077, 7295605, 'Insinyur', 'Insinyur', 'S3', 'S3', 16283682, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (151, 70, 6886478, 4758441, 'PNS Golongan III', 'Teknisi', 'S1', 'S2', 11644919, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (152, 71, 10395324, 5267205, 'Direktur', 'Polisi', 'S1', 'D4', 15662529, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (153, 72, 6675545, 5306951, 'Dosen', 'PNS Golongan III', 'S2', 'S2', 11982496, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (154, 73, 10271077, 5196255, 'PNS Golongan III', 'Perawat', 'D4', 'D3', 15467332, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (155, 74, 11915353, 6929570, 'Konsultan', 'Guru', 'S3', 'D3', 18844923, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (156, 75, 9247209, 6412746, 'Dosen', 'Dosen', 'S2', 'D3', 15659955, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (157, 76, 3416976, 2734865, 'TNI', 'Wiraswasta', 'SMK', 'SD', 6151841, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (171, 90, 5237796, 3779540, 'Karyawan Swasta', 'Wiraswasta', 'SMA', 'SMA', 9017336, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (173, 92, 5297750, 3860506, 'Guru', 'Wiraswasta', 'SMA', 'SMP', 9158256, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (174, 93, 3575681, 2500923, 'Teknisi', 'Guru', 'SMK', 'SD', 6076604, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (175, 94, 5553850, 2773188, 'Wiraswasta', 'Teknisi', 'D3', 'SMK', 8327038, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (176, 95, 3550830, 3806063, 'TNI', 'Ibu Rumah Tangga', 'D3', 'SMA', 7356893, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (177, 96, 2069690, 1298720, 'Ojek', 'Petani', 'SMP', 'SD', 3368410, 'Menengah', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (178, 97, 2350299, 1634422, 'Ojek', 'Supir', 'SD', 'SMP', 3984721, 'Menengah', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (179, 98, 2160521, 1261202, 'Petani', 'Tukang', 'SMP', 'SMP', 3421723, 'Menengah', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (180, 99, 1756290, 1046342, 'Petani', 'Pembantu', 'SD', 'SMP', 2802632, 'Menengah', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');
INSERT INTO public.penghasilan_ortu VALUES (181, 100, 2080707, 1360191, 'Ojek', 'Pembantu', 'SMP', 'SMP', 3440898, 'Menengah', '2025-06-15 09:27:19.129101', '2025-06-15 11:44:50.851691');


--
-- Data for Name: presensi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.presensi VALUES (105, 3, 'Ganjil', '2023/2024', 90, 2, 0, 0, 97.83, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (106, 4, 'Ganjil', '2023/2024', 96, 3, 0, 0, 96.97, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (107, 5, 'Ganjil', '2023/2024', 95, 0, 0, 0, 100, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (108, 6, 'Ganjil', '2023/2024', 96, 0, 0, 0, 100, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (109, 7, 'Ganjil', '2023/2024', 92, 2, 0, 0, 97.87, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (110, 8, 'Ganjil', '2023/2024', 93, 1, 1, 0, 97.89, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (111, 9, 'Ganjil', '2023/2024', 95, 1, 0, 0, 98.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (112, 10, 'Ganjil', '2023/2024', 96, 2, 2, 0, 96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (113, 11, 'Ganjil', '2023/2024', 98, 0, 2, 0, 98, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (114, 12, 'Ganjil', '2023/2024', 97, 3, 0, 0, 97, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (115, 13, 'Ganjil', '2023/2024', 91, 1, 0, 0, 98.91, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (116, 14, 'Ganjil', '2023/2024', 96, 3, 1, 1, 95.05, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (117, 15, 'Ganjil', '2023/2024', 98, 0, 2, 1, 97.03, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (118, 16, 'Ganjil', '2023/2024', 94, 1, 1, 0, 97.92, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (119, 17, 'Ganjil', '2023/2024', 91, 2, 1, 0, 96.81, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (120, 18, 'Ganjil', '2023/2024', 90, 1, 0, 0, 98.9, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (121, 19, 'Ganjil', '2023/2024', 97, 2, 0, 0, 97.98, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (122, 20, 'Ganjil', '2023/2024', 97, 2, 1, 1, 96.04, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (123, 21, 'Ganjil', '2023/2024', 92, 3, 2, 1, 93.88, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (124, 22, 'Ganjil', '2023/2024', 92, 3, 1, 0, 95.83, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (125, 23, 'Ganjil', '2023/2024', 95, 2, 1, 1, 95.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (126, 24, 'Ganjil', '2023/2024', 91, 1, 0, 1, 97.85, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (127, 25, 'Ganjil', '2023/2024', 96, 2, 1, 1, 96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (128, 26, 'Ganjil', '2023/2024', 97, 3, 1, 0, 96.04, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (129, 27, 'Ganjil', '2023/2024', 93, 0, 2, 1, 96.88, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (130, 28, 'Ganjil', '2023/2024', 95, 1, 0, 0, 98.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (131, 29, 'Ganjil', '2023/2024', 96, 0, 1, 1, 97.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (132, 30, 'Ganjil', '2023/2024', 91, 0, 0, 0, 100, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (133, 31, 'Ganjil', '2023/2024', 97, 1, 2, 1, 96.04, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (134, 32, 'Ganjil', '2023/2024', 92, 2, 2, 1, 94.85, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (135, 33, 'Ganjil', '2023/2024', 90, 3, 0, 0, 96.77, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (136, 34, 'Ganjil', '2023/2024', 95, 3, 1, 0, 95.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (137, 35, 'Ganjil', '2023/2024', 97, 3, 2, 0, 95.1, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (138, 36, 'Ganjil', '2023/2024', 90, 2, 0, 0, 97.83, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (139, 37, 'Ganjil', '2023/2024', 94, 3, 0, 1, 95.92, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (140, 38, 'Ganjil', '2023/2024', 92, 2, 2, 0, 95.83, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (141, 39, 'Ganjil', '2023/2024', 97, 3, 0, 1, 96.04, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (142, 40, 'Ganjil', '2023/2024', 91, 2, 0, 0, 97.85, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (143, 41, 'Ganjil', '2023/2024', 90, 3, 2, 0, 94.74, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (144, 42, 'Ganjil', '2023/2024', 95, 3, 1, 0, 95.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (145, 43, 'Ganjil', '2023/2024', 92, 1, 1, 0, 97.87, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (146, 44, 'Ganjil', '2023/2024', 92, 3, 2, 0, 94.85, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (147, 45, 'Ganjil', '2023/2024', 94, 3, 0, 1, 95.92, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (148, 46, 'Ganjil', '2023/2024', 96, 0, 1, 1, 97.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (149, 47, 'Ganjil', '2023/2024', 90, 0, 1, 0, 98.9, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (150, 48, 'Ganjil', '2023/2024', 97, 3, 1, 0, 96.04, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (151, 49, 'Ganjil', '2023/2024', 96, 0, 2, 0, 97.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (152, 50, 'Ganjil', '2023/2024', 92, 0, 0, 1, 98.92, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (153, 51, 'Ganjil', '2023/2024', 95, 1, 2, 1, 95.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (154, 52, 'Ganjil', '2023/2024', 93, 3, 2, 0, 94.9, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (155, 53, 'Ganjil', '2023/2024', 93, 2, 2, 0, 95.88, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (156, 54, 'Ganjil', '2023/2024', 91, 2, 2, 0, 95.79, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (157, 55, 'Ganjil', '2023/2024', 93, 0, 1, 1, 97.89, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (158, 56, 'Ganjil', '2023/2024', 98, 1, 0, 1, 98, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (159, 57, 'Ganjil', '2023/2024', 93, 1, 1, 0, 97.89, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (160, 58, 'Ganjil', '2023/2024', 91, 0, 0, 1, 98.91, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (161, 59, 'Ganjil', '2023/2024', 90, 1, 0, 1, 97.83, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (162, 60, 'Ganjil', '2023/2024', 91, 2, 2, 0, 95.79, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (163, 61, 'Ganjil', '2023/2024', 94, 2, 2, 1, 94.95, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (164, 62, 'Ganjil', '2023/2024', 93, 3, 0, 0, 96.88, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (165, 63, 'Ganjil', '2023/2024', 90, 0, 2, 0, 97.83, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (166, 64, 'Ganjil', '2023/2024', 98, 2, 2, 0, 96.08, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (167, 65, 'Ganjil', '2023/2024', 98, 1, 0, 1, 98, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (168, 66, 'Ganjil', '2023/2024', 97, 3, 1, 1, 95.1, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (169, 67, 'Ganjil', '2023/2024', 90, 2, 2, 0, 95.74, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (170, 68, 'Ganjil', '2023/2024', 90, 1, 0, 0, 98.9, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (171, 69, 'Ganjil', '2023/2024', 90, 3, 2, 1, 93.75, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (172, 70, 'Ganjil', '2023/2024', 90, 0, 2, 1, 96.77, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (173, 71, 'Ganjil', '2023/2024', 98, 2, 1, 1, 96.08, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (174, 72, 'Ganjil', '2023/2024', 97, 3, 1, 1, 95.1, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (175, 73, 'Ganjil', '2023/2024', 90, 1, 2, 0, 96.77, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (176, 74, 'Ganjil', '2023/2024', 95, 0, 0, 1, 98.96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (177, 75, 'Ganjil', '2023/2024', 96, 2, 2, 0, 96, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (178, 76, 'Ganjil', '2023/2024', 83, 3, 2, 1, 93.26, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (179, 77, 'Ganjil', '2023/2024', 80, 5, 2, 1, 90.91, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (180, 78, 'Ganjil', '2023/2024', 78, 5, 4, 3, 86.67, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (181, 79, 'Ganjil', '2023/2024', 84, 2, 2, 2, 93.33, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (182, 80, 'Ganjil', '2023/2024', 86, 2, 2, 1, 94.51, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (183, 81, 'Ganjil', '2023/2024', 87, 2, 3, 1, 93.55, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (184, 82, 'Ganjil', '2023/2024', 87, 3, 2, 2, 92.55, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (185, 83, 'Ganjil', '2023/2024', 85, 3, 1, 1, 94.44, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (103, 101, 'Ganjil', '2023/2024', 94, 0, 0, 1, 98.95, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (104, 2, 'Ganjil', '2023/2024', 98, 0, 2, 0, 98, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (186, 84, 'Ganjil', '2023/2024', 76, 4, 1, 3, 90.48, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (187, 85, 'Ganjil', '2023/2024', 81, 5, 4, 2, 88.04, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (188, 86, 'Ganjil', '2023/2024', 75, 5, 1, 2, 90.36, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (189, 87, 'Ganjil', '2023/2024', 83, 3, 2, 3, 91.21, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (190, 88, 'Ganjil', '2023/2024', 75, 4, 4, 3, 87.21, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (191, 89, 'Ganjil', '2023/2024', 84, 5, 3, 3, 88.42, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (192, 90, 'Ganjil', '2023/2024', 88, 5, 3, 3, 88.89, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (193, 91, 'Ganjil', '2023/2024', 84, 4, 2, 1, 92.31, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (194, 92, 'Ganjil', '2023/2024', 80, 4, 4, 3, 87.91, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (195, 93, 'Ganjil', '2023/2024', 88, 3, 4, 3, 89.8, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (196, 94, 'Ganjil', '2023/2024', 88, 2, 3, 1, 93.62, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (197, 95, 'Ganjil', '2023/2024', 76, 4, 2, 3, 89.41, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (198, 96, 'Ganjil', '2023/2024', 70, 10, 4, 9, 75.27, 'Sedang', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (199, 97, 'Ganjil', '2023/2024', 68, 6, 6, 7, 78.16, 'Sedang', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (200, 98, 'Ganjil', '2023/2024', 62, 6, 7, 12, 71.26, 'Rendah', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (201, 99, 'Ganjil', '2023/2024', 74, 10, 3, 6, 79.57, 'Sedang', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');
INSERT INTO public.presensi VALUES (202, 100, 'Ganjil', '2023/2024', 72, 10, 3, 5, 80, 'Tinggi', '2025-06-15 09:27:19.129101', '2025-06-15 12:02:48.840606');


--
-- Data for Name: prestasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.prestasi VALUES (35, 32, 'Ganjil', '2023/2024', 'Tinggi', 1, '2025-06-15 12:41:02.881554', '2025-06-15 12:41:02.881559');
INSERT INTO public.prestasi VALUES (36, 99, 'Ganjil', '2023/2024', 'Rendah', 1, '2025-06-15 12:41:58.813094', '2025-06-15 12:41:58.8131');
INSERT INTO public.prestasi VALUES (37, 98, 'Ganjil', '2023/2024', 'Rendah', 1, '2025-06-15 12:42:41.915539', '2025-06-15 12:42:41.915544');
INSERT INTO public.prestasi VALUES (34, 31, 'Ganjil', '2023/2024', 'Tinggi', 1, '2025-06-15 12:40:41.128478', '2025-06-15 13:11:26.439943');
INSERT INTO public.prestasi VALUES (38, 33, 'Ganjil', '2023/2024', 'Tinggi', 1, '2025-06-15 14:26:26.956091', '2025-06-15 14:26:26.956096');


--
-- Data for Name: siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.siswa VALUES (31, 'Ratna Putri', '2023030', 'Perempuan', 'XII IPS 1', '2005-06-04 00:00:00', 'Jl. Pemuda No. 30', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (32, 'Toni Wijaya', '2023031', 'Laki-laki', 'XII IPA 3', '2005-01-26 00:00:00', 'Jl. Gatot Subroto No. 31', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (33, 'Nurhaliza Putri', '2023032', 'Perempuan', 'XII IPS 2', '2005-04-05 00:00:00', 'Jl. Veteran No. 32', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (34, 'Ahmad Pratama', '2023033', 'Laki-laki', 'XII IPA 3', '2005-12-13 00:00:00', 'Jl. Pemuda No. 33', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (35, 'Mulyani Putri', '2023034', 'Perempuan', 'XII IPS 1', '2005-09-06 00:00:00', 'Jl. Veteran No. 34', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (36, 'Bambang Rizki', '2023035', 'Laki-laki', 'XII IPA 1', '2005-10-11 00:00:00', 'Jl. Proklamasi No. 35', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (37, 'Marlina Dewi', '2023036', 'Perempuan', 'XII IPS 1', '2005-05-25 00:00:00', 'Jl. Pahlawan No. 36', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (39, 'Siti Handayani', '2023038', 'Perempuan', 'XII IPS 1', '2005-12-15 00:00:00', 'Jl. Pahlawan No. 38', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (40, 'Dewi Sari', '2023039', 'Perempuan', 'XII IPA 2', '2005-02-04 00:00:00', 'Jl. Sudirman No. 39', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (41, 'Siti Sari', '2023040', 'Perempuan', 'XII IPA 3', '2005-04-15 00:00:00', 'Jl. Gatot Subroto No. 40', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (42, 'Sartika Sari', '2023041', 'Perempuan', 'XII IPA 3', '2005-07-13 00:00:00', 'Jl. Merdeka No. 41', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (43, 'Rudi Wijaya', '2023042', 'Laki-laki', 'XII IPA 2', '2005-09-14 00:00:00', 'Jl. Merdeka No. 42', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (44, 'Fitri Handayani', '2023043', 'Perempuan', 'XII IPA 2', '2005-08-04 00:00:00', 'Jl. Kartini No. 43', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (45, 'Nurhaliza Sari', '2023044', 'Perempuan', 'XII IPS 2', '2005-01-20 00:00:00', 'Jl. Sudirman No. 44', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (46, 'Wijaya Nugroho', '2023045', 'Laki-laki', 'XII IPS 2', '2005-01-23 00:00:00', 'Jl. Veteran No. 45', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (47, 'Nugroho Nugroho', '2023046', 'Laki-laki', 'XII IPS 1', '2005-01-07 00:00:00', 'Jl. Proklamasi No. 46', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (48, 'Melati Sari', '2023047', 'Perempuan', 'XII IPA 3', '2005-01-10 00:00:00', 'Jl. Ahmad Yani No. 47', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (49, 'Wijaya Rizki', '2023048', 'Laki-laki', 'XII IPS 2', '2005-04-24 00:00:00', 'Jl. Kartini No. 48', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (50, 'Budi Pratama', '2023049', 'Laki-laki', 'XII IPS 1', '2005-11-09 00:00:00', 'Jl. Pahlawan No. 49', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (51, 'Nugroho Rizki', '2023050', 'Laki-laki', 'XII IPS 1', '2005-10-26 00:00:00', 'Jl. Gatot Subroto No. 50', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (52, 'Sutrisno Wijaya', '2023051', 'Laki-laki', 'XII IPS 2', '2005-07-08 00:00:00', 'Jl. Sudirman No. 51', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (53, 'Nugroho Wijaya', '2023052', 'Laki-laki', 'XII IPS 1', '2005-06-26 00:00:00', 'Jl. Merdeka No. 52', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (54, 'Fajar Wijaya', '2023053', 'Laki-laki', 'XII IPA 2', '2005-04-08 00:00:00', 'Jl. Ahmad Yani No. 53', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (55, 'Yoga Rizki', '2023054', 'Laki-laki', 'XII IPA 2', '2005-11-08 00:00:00', 'Jl. Gatot Subroto No. 54', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (56, 'Pratama Rizki', '2023055', 'Laki-laki', 'XII IPS 2', '2005-05-04 00:00:00', 'Jl. Pemuda No. 55', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (57, 'Joko Rizki', '2023056', 'Laki-laki', 'XII IPS 2', '2005-06-18 00:00:00', 'Jl. Sudirman No. 56', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (58, 'Fajar Pratama', '2023057', 'Laki-laki', 'XII IPA 1', '2005-10-27 00:00:00', 'Jl. Gatot Subroto No. 57', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (59, 'Indira Sari', '2023058', 'Perempuan', 'XII IPS 2', '2005-04-07 00:00:00', 'Jl. Sudirman No. 58', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (60, 'Rina Dewi', '2023059', 'Perempuan', 'XII IPA 2', '2005-09-06 00:00:00', 'Jl. Kartini No. 59', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (61, 'Nurhaliza Handayani', '2023060', 'Perempuan', 'XII IPS 1', '2005-01-13 00:00:00', 'Jl. Veteran No. 60', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (62, 'Santoso Wijaya', '2023061', 'Laki-laki', 'XII IPS 1', '2005-11-03 00:00:00', 'Jl. Veteran No. 61', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (63, 'Lina Dewi', '2023062', 'Perempuan', 'XII IPS 2', '2005-01-19 00:00:00', 'Jl. Pemuda No. 62', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (64, 'Maya Sari', '2023063', 'Perempuan', 'XII IPA 1', '2005-12-25 00:00:00', 'Jl. Gatot Subroto No. 63', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (65, 'Nugroho Wijaya', '2023064', 'Laki-laki', 'XII IPA 2', '2005-03-10 00:00:00', 'Jl. Proklamasi No. 64', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (66, 'Rina Putri', '2023065', 'Perempuan', 'XII IPA 1', '2005-04-11 00:00:00', 'Jl. Gatot Subroto No. 65', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (67, 'Melati Sari', '2023066', 'Perempuan', 'XII IPA 3', '2005-01-03 00:00:00', 'Jl. Ahmad Yani No. 66', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (68, 'Hendra Rizki', '2023067', 'Laki-laki', 'XII IPS 2', '2005-12-10 00:00:00', 'Jl. Diponegoro No. 67', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (69, 'Wahyu Pratama', '2023068', 'Laki-laki', 'XII IPA 2', '2005-01-19 00:00:00', 'Jl. Proklamasi No. 68', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (70, 'Eka Handayani', '2023069', 'Perempuan', 'XII IPS 1', '2005-10-19 00:00:00', 'Jl. Veteran No. 69', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (71, 'Putri Handayani', '2023070', 'Perempuan', 'XII IPS 2', '2005-03-21 00:00:00', 'Jl. Ahmad Yani No. 70', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (72, 'Sri Sari', '2023071', 'Perempuan', 'XII IPS 1', '2005-04-15 00:00:00', 'Jl. Pemuda No. 71', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (73, 'Nurhaliza Putri', '2023072', 'Perempuan', 'XII IPA 3', '2005-01-16 00:00:00', 'Jl. Veteran No. 72', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (74, 'Gunawan Nugroho', '2023073', 'Laki-laki', 'XII IPA 3', '2005-09-14 00:00:00', 'Jl. Ahmad Yani No. 73', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (75, 'Eka Handayani', '2023074', 'Perempuan', 'XII IPA 1', '2005-07-15 00:00:00', 'Jl. Proklamasi No. 74', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (76, 'Dedi Santoso', '2023075', 'Laki-laki', 'XII IPS 2', '2005-12-25 00:00:00', 'Jl. Veteran No. 75', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (77, 'Siti Dewi', '2023076', 'Perempuan', 'XII IPA 1', '2005-09-20 00:00:00', 'Jl. Pahlawan No. 76', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (78, 'Handayani Sari', '2023077', 'Perempuan', 'XII IPA 3', '2005-09-23 00:00:00', 'Jl. Pemuda No. 77', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (79, 'Fitri Sari', '2023078', 'Perempuan', 'XII IPA 1', '2005-04-20 00:00:00', 'Jl. Proklamasi No. 78', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (80, 'Doni Pratama', '2023079', 'Laki-laki', 'XII IPA 3', '2005-12-17 00:00:00', 'Jl. Sudirman No. 79', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (81, 'Sari Handayani', '2023080', 'Perempuan', 'XII IPA 1', '2005-05-13 00:00:00', 'Jl. Merdeka No. 80', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (82, 'Sri Handayani', '2023081', 'Perempuan', 'XII IPA 3', '2005-08-20 00:00:00', 'Jl. Ahmad Yani No. 81', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (83, 'Rina Dewi', '2023082', 'Perempuan', 'XII IPS 2', '2005-03-17 00:00:00', 'Jl. Pemuda No. 82', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (84, 'Rudi Rizki', '2023083', 'Laki-laki', 'XII IPA 3', '2005-01-03 00:00:00', 'Jl. Gatot Subroto No. 83', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (85, 'Melati Melati', '2023084', 'Perempuan', 'XII IPA 3', '2005-04-26 00:00:00', 'Jl. Pahlawan No. 84', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (86, 'Melati Dewi', '2023085', 'Perempuan', 'XII IPA 2', '2005-10-13 00:00:00', 'Jl. Gatot Subroto No. 85', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (87, 'Indira Melati', '2023086', 'Perempuan', 'XII IPS 2', '2005-08-16 00:00:00', 'Jl. Gatot Subroto No. 86', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (88, 'Dedi Rizki', '2023087', 'Laki-laki', 'XII IPS 2', '2005-09-25 00:00:00', 'Jl. Pemuda No. 87', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (89, 'Rudi Nugroho', '2023088', 'Laki-laki', 'XII IPA 3', '2005-05-13 00:00:00', 'Jl. Merdeka No. 88', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (90, 'Toni Nugroho', '2023089', 'Laki-laki', 'XII IPS 1', '2005-08-03 00:00:00', 'Jl. Diponegoro No. 89', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (91, 'Wijaya Pratama', '2023090', 'Laki-laki', 'XII IPA 1', '2005-11-07 00:00:00', 'Jl. Veteran No. 90', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (92, 'Rudi Rizki', '2023091', 'Laki-laki', 'XII IPA 1', '2005-09-21 00:00:00', 'Jl. Veteran No. 91', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (93, 'Sartika Dewi', '2023092', 'Perempuan', 'XII IPA 2', '2005-10-07 00:00:00', 'Jl. Kartini No. 92', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (94, 'Salim Wijaya', '2023093', 'Laki-laki', 'XII IPA 3', '2005-12-17 00:00:00', 'Jl. Diponegoro No. 93', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (95, 'Marlina Handayani', '2023094', 'Perempuan', 'XII IPA 2', '2005-05-21 00:00:00', 'Jl. Diponegoro No. 94', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (2, 'Andi Wijaya', '2023001', 'Laki-laki', 'XII IPA 2', '2005-07-05 00:00:00', 'Jl. Kartini No. 1', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (3, 'Melati Putri', '2023002', 'Perempuan', 'XII IPS 1', '2005-08-22 00:00:00', 'Jl. Merdeka No. 2', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (4, 'Melati Melati', '2023003', 'Perempuan', 'XII IPA 2', '2005-02-26 00:00:00', 'Jl. Veteran No. 3', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (5, 'Handayani Handayani', '2023004', 'Perempuan', 'XII IPA 2', '2005-01-01 00:00:00', 'Jl. Sudirman No. 4', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (6, 'Salim Rizki', '2023005', 'Laki-laki', 'XII IPA 3', '2005-08-23 00:00:00', 'Jl. Pahlawan No. 5', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (7, 'Nurhaliza Handayani', '2023006', 'Perempuan', 'XII IPS 1', '2005-09-16 00:00:00', 'Jl. Merdeka No. 6', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (8, 'Sartika Dewi', '2023007', 'Perempuan', 'XII IPS 2', '2005-12-03 00:00:00', 'Jl. Diponegoro No. 7', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (9, 'Eka Handayani', '2023008', 'Perempuan', 'XII IPS 1', '2005-08-19 00:00:00', 'Jl. Merdeka No. 8', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (10, 'Mulyani Sari', '2023009', 'Perempuan', 'XII IPA 2', '2005-10-22 00:00:00', 'Jl. Pahlawan No. 9', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (11, 'Nurhaliza Putri', '2023010', 'Perempuan', 'XII IPA 2', '2005-11-11 00:00:00', 'Jl. Ahmad Yani No. 10', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (12, 'Doni Pratama', '2023011', 'Laki-laki', 'XII IPS 2', '2005-03-13 00:00:00', 'Jl. Pahlawan No. 11', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (13, 'Joko Pratama', '2023012', 'Laki-laki', 'XII IPA 2', '2005-10-02 00:00:00', 'Jl. Ahmad Yani No. 12', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (14, 'Sari Putri', '2023013', 'Perempuan', 'XII IPA 2', '2005-07-23 00:00:00', 'Jl. Diponegoro No. 13', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (15, 'Santoso Pratama', '2023014', 'Laki-laki', 'XII IPS 2', '2005-11-07 00:00:00', 'Jl. Ahmad Yani No. 14', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (16, 'Rizki Pratama', '2023015', 'Laki-laki', 'XII IPA 1', '2005-01-15 00:00:00', 'Jl. Pemuda No. 15', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (17, 'Putri Handayani', '2023016', 'Perempuan', 'XII IPA 1', '2005-07-14 00:00:00', 'Jl. Proklamasi No. 16', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (18, 'Fitri Dewi', '2023017', 'Perempuan', 'XII IPS 2', '2005-01-08 00:00:00', 'Jl. Sudirman No. 17', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (19, 'Lina Melati', '2023018', 'Perempuan', 'XII IPS 1', '2005-10-20 00:00:00', 'Jl. Veteran No. 18', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (20, 'Eka Dewi', '2023019', 'Perempuan', 'XII IPA 2', '2005-04-06 00:00:00', 'Jl. Proklamasi No. 19', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (21, 'Fajar Pratama', '2023020', 'Laki-laki', 'XII IPA 3', '2005-08-07 00:00:00', 'Jl. Sudirman No. 20', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (22, 'Ratna Melati', '2023021', 'Perempuan', 'XII IPA 3', '2005-02-18 00:00:00', 'Jl. Kartini No. 21', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (23, 'Doni Santoso', '2023022', 'Laki-laki', 'XII IPA 2', '2005-11-06 00:00:00', 'Jl. Kartini No. 22', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (24, 'Kurniawan Rizki', '2023023', 'Laki-laki', 'XII IPS 1', '2005-06-01 00:00:00', 'Jl. Veteran No. 23', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (25, 'Wijaya Wijaya', '2023024', 'Laki-laki', 'XII IPS 2', '2005-02-14 00:00:00', 'Jl. Merdeka No. 24', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (26, 'Sri Handayani', '2023025', 'Perempuan', 'XII IPS 2', '2005-02-13 00:00:00', 'Jl. Pemuda No. 25', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (27, 'Pratama Pratama', '2023026', 'Laki-laki', 'XII IPS 2', '2005-07-22 00:00:00', 'Jl. Diponegoro No. 26', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (28, 'Bambang Wijaya', '2023027', 'Laki-laki', 'XII IPA 1', '2005-09-14 00:00:00', 'Jl. Kartini No. 27', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (29, 'Toni Rizki', '2023028', 'Laki-laki', 'XII IPA 3', '2005-11-28 00:00:00', 'Jl. Gatot Subroto No. 28', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (30, 'Widodo Wijaya', '2023029', 'Laki-laki', 'XII IPA 2', '2005-11-21 00:00:00', 'Jl. Merdeka No. 29', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (38, 'Dedi Nugroho', '2023037', 'Laki-laki', 'XII IPA 1', '2005-11-05 00:00:00', 'Jl. Ahmad Yani No. 37', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (96, 'Widodo Pratama', '2023095', 'Laki-laki', 'XII IPS 1', '2005-05-18 00:00:00', 'Jl. Merdeka No. 95', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (97, 'Melati Melati', '2023096', 'Perempuan', 'XII IPA 1', '2005-10-13 00:00:00', 'Jl. Sudirman No. 96', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (98, 'Eka Putri', '2023097', 'Perempuan', 'XII IPS 2', '2005-03-16 00:00:00', 'Jl. Proklamasi No. 97', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (99, 'Mulyani Melati', '2023098', 'Perempuan', 'XII IPA 2', '2005-09-11 00:00:00', 'Jl. Sudirman No. 98', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (100, 'Eka Dewi', '2023099', 'Perempuan', 'XII IPA 2', '2005-01-20 00:00:00', 'Jl. Veteran No. 99', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');
INSERT INTO public.siswa VALUES (101, 'Sri Sari', '2023100', 'Perempuan', 'XII IPA 1', '2005-02-14 00:00:00', 'Jl. Veteran No. 100', '2025-06-15 09:21:33.232373', '2025-06-15 09:22:21.022633');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (4, 'asdasda', '$2b$12$HyhtDkrZPZPTI1mnHXXE6eLn0SqCcIGr5WfvUHAqlI/A3uS2Ohgx.', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'asdasda@email.com');
INSERT INTO public.users VALUES (5, 'kkkm', '$2b$12$Wc8mii3fXjYCqk2unQuTDuRkwzT65DgEp30td/.vYGrFCvp/PvuF6', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'kkkm@email.com');
INSERT INTO public.users VALUES (8, 'supaya', '$2b$12$oc3N0Yp61l60nQHuRalKAepJlAK86FsR8qrrQCRikWYgxRe3x/4ny', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'supaya@email.com');
INSERT INTO public.users VALUES (9, 'yujupelas', '$2b$12$Ogil8z.woGb3n3W41YC4hu8V2sDpWkDrj7Jk2P729za6tCdzWWrtq', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'yujupelas@email.com');
INSERT INTO public.users VALUES (10, 'tujuj', '$2b$12$G337ogal8mWWgfOZciEUDey5jU./WDGc.uM0YarHnfQAUZR4mBowe', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'tujuj@email.com');
INSERT INTO public.users VALUES (11, 'tuuhuh', '$2b$12$U.mXT8tr4LHLllsE8eXOUusc9ZWmwwHlRDEMzdqAt7Y5oW2g/UJM6', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'tuuhuh@email.com');
INSERT INTO public.users VALUES (12, 'pololo', '$2b$12$H3a9uLPKHgDGk6Np9G.cO.lnDnNZSCt2cUlITfjAir6xp6Wpq9LZG', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'pololo@email.com');
INSERT INTO public.users VALUES (3, 'staff', '$2b$12$EWkC/hdIN4va5QlNN0KrFO7efZOMWuyX8PWh1fSvKrCRMmOx0UUyu', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'staff', true, 'staff@email.com');
INSERT INTO public.users VALUES (1, 'admin', '$2b$12$w//UUILUzgXLX.amp8egQuBVHWqZYu61vkJGpz1ViU4aNeNAUEaT.', '{
        "nip": "1233",
        "nama_lengkap": "Administrator",
        "jabatan": "Admin",
        "no_hp": "1234",
        "alamat": "jl jalan"
    }', 'admin', true, 'admin@email.com');
INSERT INTO public.users VALUES (2, 'teacher', '$2b$12$hwrqgc1srOHB42pv9TU7Au8mYo.tmB98S9UI/7y.TV2Z62x3JX1D.', '{
        "nip": "",
        "nama_lengkap": "",
        "jabatan": "",
        "no_hp": "",
        "alamat": ""
    }', 'guru', true, 'teacher@email.com');


--
-- Name: nilai_raport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nilai_raport_id_seq', 413, true);


--
-- Name: penghasilan_ortu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penghasilan_ortu_id_seq', 181, true);


--
-- Name: presensi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presensi_id_seq', 202, true);


--
-- Name: prestasi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prestasi_id_seq', 40, true);


--
-- Name: siswa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.siswa_id_seq', 101, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- Name: nilai_raport nilai_raport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nilai_raport
    ADD CONSTRAINT nilai_raport_pkey PRIMARY KEY (id);


--
-- Name: penghasilan_ortu penghasilan_ortu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penghasilan_ortu
    ADD CONSTRAINT penghasilan_ortu_pkey PRIMARY KEY (id);


--
-- Name: presensi presensi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presensi
    ADD CONSTRAINT presensi_pkey PRIMARY KEY (id);


--
-- Name: prestasi prestasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestasi
    ADD CONSTRAINT prestasi_pkey PRIMARY KEY (id);


--
-- Name: siswa siswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.siswa
    ADD CONSTRAINT siswa_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_nilai_raport_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_nilai_raport_id ON public.nilai_raport USING btree (id);


--
-- Name: ix_penghasilan_ortu_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_penghasilan_ortu_id ON public.penghasilan_ortu USING btree (id);


--
-- Name: ix_presensi_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_presensi_id ON public.presensi USING btree (id);


--
-- Name: ix_prestasi_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_prestasi_id ON public.prestasi USING btree (id);


--
-- Name: ix_siswa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_siswa_id ON public.siswa USING btree (id);


--
-- Name: ix_siswa_nama; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_siswa_nama ON public.siswa USING btree (nama);


--
-- Name: ix_siswa_nis; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_siswa_nis ON public.siswa USING btree (nis);


--
-- Name: nilai_raport nilai_raport_siswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nilai_raport
    ADD CONSTRAINT nilai_raport_siswa_id_fkey FOREIGN KEY (siswa_id) REFERENCES public.siswa(id);


--
-- Name: penghasilan_ortu penghasilan_ortu_siswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penghasilan_ortu
    ADD CONSTRAINT penghasilan_ortu_siswa_id_fkey FOREIGN KEY (siswa_id) REFERENCES public.siswa(id);


--
-- Name: presensi presensi_siswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presensi
    ADD CONSTRAINT presensi_siswa_id_fkey FOREIGN KEY (siswa_id) REFERENCES public.siswa(id);


--
-- Name: prestasi prestasi_siswa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestasi
    ADD CONSTRAINT prestasi_siswa_id_fkey FOREIGN KEY (siswa_id) REFERENCES public.siswa(id);


--
-- PostgreSQL database dump complete
--

