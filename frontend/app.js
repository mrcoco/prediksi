// Inisialisasi aplikasi
$(document).ready(function() {
    // Sidebar collapse functionality
    const sidebar = $('#sidebar');
    const mainContent = $('#mainContent');
    const sidebarToggle = $('#sidebar-toggle');
    const toggleButton = $('#toggleSidebar');
    const sidebarOverlay = $('#sidebarOverlay');
    
    // Initialize sidebar state
    let sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Enhanced function to update main content size - PERFECT VERSION ✅
    function updateMainContentSize() {
        const windowWidth = window.innerWidth;
        
        // Remove all inline styles first to reset
        mainContent.removeAttr('style');
        
        if (windowWidth > 768) {
            // Desktop mode
            if (sidebarCollapsed) {
                // Collapsed state: sidebar 60px
                mainContent.css({
                    'margin-left': '60px !important',
                    'width': 'calc(100% - 60px) !important',
                    'max-width': 'calc(100% - 60px) !important'
                });
                
                // Ensure CSS classes are applied
                if (!sidebar.hasClass('collapsed')) {
                    sidebar.addClass('collapsed');
                }
                if (!mainContent.hasClass('sidebar-collapsed')) {
                    mainContent.addClass('sidebar-collapsed');
                }
                if (!sidebarToggle.hasClass('collapsed')) {
                    sidebarToggle.addClass('collapsed');
                }
            } else {
                // Normal state: sidebar 250px
                mainContent.css({
                    'margin-left': '250px !important',
                    'width': 'calc(100% - 250px) !important',
                    'max-width': 'calc(100% - 250px) !important'
                });
                
                // Remove collapsed classes
                sidebar.removeClass('collapsed');
                mainContent.removeClass('sidebar-collapsed');
                sidebarToggle.removeClass('collapsed');
            }
        } else {
            // Mobile mode - always full width with !important
            mainContent.css({
                'margin-left': '0 !important',
                'width': '100% !important',
                'max-width': '100% !important'
            });
            
            // Remove desktop classes in mobile
            sidebar.removeClass('collapsed');
            mainContent.removeClass('sidebar-collapsed');
            sidebarToggle.removeClass('collapsed');
        }
        
        // Force multiple layout recalculations
        mainContent[0].offsetHeight;
        mainContent[0].offsetWidth;
        
        // Trigger resize event to ensure all elements adjust
        $(window).trigger('resize.mainContent');
    }
    
    // Apply initial state with multiple attempts
    if (window.innerWidth > 768 && sidebarCollapsed) {
        sidebar.addClass('collapsed');
        mainContent.addClass('sidebar-collapsed');
        sidebarToggle.addClass('collapsed');
    }
    
    // Update main content size on load with multiple delays
    setTimeout(function() {
        updateMainContentSize();
    }, 50);
    
    setTimeout(function() {
        updateMainContentSize();
    }, 200);
    
    setTimeout(function() {
        updateMainContentSize();
    }, 500);
    
    // Enhanced toggle sidebar function with immediate updates
    function toggleSidebar() {
        const windowWidth = window.innerWidth;
        sidebarCollapsed = !sidebarCollapsed;
        
        if (windowWidth <= 768) {
            // Mobile behavior
            sidebar.toggleClass('show');
            sidebarOverlay.toggleClass('show');
            
            // Don't change sidebarCollapsed state for mobile
            if (!sidebar.hasClass('show')) {
                sidebarCollapsed = false;
            }
        } else {
            // Desktop behavior
            sidebar.toggleClass('collapsed');
            mainContent.toggleClass('sidebar-collapsed');
            sidebarToggle.toggleClass('collapsed');
            
            // Immediate size update
            updateMainContentSize();
            
            // Additional updates with delays
            setTimeout(function() {
                updateMainContentSize();
            }, 10);
            
            setTimeout(function() {
                updateMainContentSize();
            }, 100);
        }
        
        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }
    
    // Toggle button click event
    toggleButton.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });
    
    // Overlay click event (mobile)
    sidebarOverlay.on('click', function() {
        if (window.innerWidth <= 768) {
            sidebar.removeClass('show');
            sidebarOverlay.removeClass('show');
            sidebarCollapsed = false;
            localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
        }
    });
    
    // Periodic check to ensure sizing is correct - ENHANCED VERSION ✅
    setInterval(function() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth > 768) {
            const currentMarginLeft = parseInt(mainContent.css('margin-left')) || 0;
            const currentWidth = mainContent.width();
            const expectedMarginLeft = sidebarCollapsed ? 60 : 250;
            const expectedWidth = windowWidth - expectedMarginLeft;
            
            // Check if margin-left is correct
            if (Math.abs(currentMarginLeft - expectedMarginLeft) > 5) {
                console.log('Correcting margin-left:', currentMarginLeft, '->', expectedMarginLeft);
                updateMainContentSize();
            }
            
            // Check if width is correct
            if (Math.abs(currentWidth - expectedWidth) > 10) {
                console.log('Correcting width:', currentWidth, '->', expectedWidth);
                updateMainContentSize();
            }
            
            // Verify CSS classes are correct
            const shouldBeCollapsed = sidebarCollapsed;
            const isCollapsed = sidebar.hasClass('collapsed');
            const mainHasClass = mainContent.hasClass('sidebar-collapsed');
            
            if (shouldBeCollapsed !== isCollapsed || shouldBeCollapsed !== mainHasClass) {
                console.log('Correcting CSS classes');
                updateMainContentSize();
            }
        }
    }, 1000); // Check every second for more aggressive monitoring
    
    // Enhanced window resize handler with immediate response
    let resizeTimeout;
    $(window).on('resize', function() {
        clearTimeout(resizeTimeout);
        
        // Immediate update
        updateMainContentSize();
        
        // Delayed update for safety
        resizeTimeout = setTimeout(function() {
            const windowWidth = window.innerWidth;
            
            if (windowWidth > 768) {
                // Desktop mode
                sidebar.removeClass('show');
                sidebarOverlay.removeClass('show');
                
                // Apply collapsed state if needed
                if (sidebarCollapsed) {
                    sidebar.addClass('collapsed');
                    mainContent.addClass('sidebar-collapsed');
                    sidebarToggle.addClass('collapsed');
                } else {
                    sidebar.removeClass('collapsed');
                    mainContent.removeClass('sidebar-collapsed');
                    sidebarToggle.removeClass('collapsed');
                }
            } else {
                // Mobile mode - remove desktop classes
                sidebar.removeClass('collapsed');
                mainContent.removeClass('sidebar-collapsed');
                sidebarToggle.removeClass('collapsed');
            }
            
            // Multiple updates for safety
            updateMainContentSize();
            setTimeout(updateMainContentSize, 50);
            setTimeout(updateMainContentSize, 150);
        }, 100);
    });
    
    // Force update on various events
    $(window).on('load', function() {
        setTimeout(updateMainContentSize, 100);
        setTimeout(updateMainContentSize, 300);
        setTimeout(updateMainContentSize, 500);
    });
    
    // Listen for CSS transition end with enhanced handling
    sidebar.on('transitionend', function(e) {
        if (e.originalEvent.propertyName === 'width' || e.originalEvent.propertyName === 'transform') {
            setTimeout(updateMainContentSize, 10);
            setTimeout(updateMainContentSize, 50);
        }
    });
    
    // Additional event listeners for perfect synchronization
    mainContent.on('transitionend', function(e) {
        if (e.originalEvent.propertyName === 'margin-left' || e.originalEvent.propertyName === 'width') {
            // Force final recalculation
            setTimeout(function() {
                mainContent[0].offsetHeight;
                mainContent[0].offsetWidth;
            }, 10);
        }
    });
    
    // Observer for DOM changes that might affect layout
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                setTimeout(updateMainContentSize, 10);
            }
        });
        
        observer.observe(sidebar[0], { 
            attributes: true, 
            attributeFilter: ['class', 'style'] 
        });
        
        observer.observe(mainContent[0], { 
            attributes: true, 
            attributeFilter: ['class', 'style'] 
        });
    }
    
    // Enhanced sidebar navigation
    $('.sidebar-link').on('click', function(e) {
        if ($(this).attr('onclick')) {
            return; // Skip if it has onclick (like logout)
        }
        
        e.preventDefault();
        
        // Remove active class from all links
        $('.sidebar-link').removeClass('active');
        
        // Add active class to clicked link
        $(this).addClass('active');
        
        // Get the page to show
        var page = $(this).data('page');
        
        // Hide all pages
        $('.page').hide();
        
        // Show the selected page
        $('#' + page + '-page').show();
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            sidebar.removeClass('show');
            sidebarOverlay.removeClass('show');
        }
        
        // Ensure main content size is correct after page change
        setTimeout(function() {
            updateMainContentSize();
        }, 50);
    });
    
    // Fungsi untuk menampilkan hasil prediksi
    function tampilkanHasilPrediksi(data) {
        const container = $('#hasil-prediksi');
        container.empty();
        
        // Buat elemen untuk menampilkan hasil
        const card = $(`
            <div class="card border-primary">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="fas fa-chart-line me-2"></i>Hasil Prediksi Prestasi</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6><strong>Nama Siswa:</strong> ${data.nama_siswa}</h6>
                            <h6><strong>Prediksi Prestasi:</strong> 
                                <span class="badge ${data.prediksi === 'Tinggi' ? 'bg-success' : data.prediksi === 'Sedang' ? 'bg-warning' : 'bg-danger'}">${data.prediksi}</span>
                            </h6>
                            <h6><strong>Tingkat Kepercayaan:</strong> ${(data.confidence * 100).toFixed(2)}%</h6>
                        </div>
                        <div class="col-md-6">
                            <h6><strong>Faktor yang Mempengaruhi:</strong></h6>
                            <ul class="list-unstyled">
                                ${data.faktor_mempengaruhi.map(faktor => `<li><i class="fas fa-arrow-right text-primary me-2"></i>${faktor}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        container.append(card);
    }
    
    // Event handler untuk prediksi
    $('#prediksi-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        
        $.ajax({
            url: '/prediksi/',
            method: 'POST',
            data: formData,
            success: function(response) {
                tampilkanHasilPrediksi(response);
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.detail : 'Terjadi kesalahan saat melakukan prediksi';
                alert('Error: ' + errorMessage);
            }
        });
    });

    // Add smooth scrolling for better UX
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 500);
        }
    });

    // Add loading states for better UX
    $(document).ajaxStart(function() {
        $('body').addClass('loading');
    }).ajaxStop(function() {
        $('body').removeClass('loading');
    });
});