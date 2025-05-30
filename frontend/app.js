// Inisialisasi aplikasi
$(document).ready(function() {
    // Navigasi sidebar
    $('.sidebar-link').click(function(e) {
        e.preventDefault();
        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');
        
        const page = $(this).data('page');
        $('.page').hide();
        $(`#${page}-page`).show();
    });
    
    // Fungsi untuk menampilkan hasil prediksi
    function tampilkanHasilPrediksi(data) {
        const container = $('#hasil-prediksi');
        container.empty();
        
        // Buat elemen untuk menampilkan hasil
        const card = $(`
            <div class="card mt-4">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Hasil Prediksi Prestasi</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Nama Siswa:</strong> ${data.nama_siswa}</p>
                            <p><strong>Prediksi Prestasi:</strong> ${data.prediksi_prestasi}</p>
                            <p><strong>Tingkat Keyakinan:</strong> ${(data.confidence * 100).toFixed(2)}%</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Faktor yang Mempengaruhi:</h6>
                            <ul class="list-group">
                                <li class="list-group-item">Nilai Rata-rata: ${data.detail_faktor.nilai_rata_rata}</li>
                                <li class="list-group-item">Kategori Penghasilan: ${data.detail_faktor.kategori_penghasilan}</li>
                                <li class="list-group-item">Kategori Kehadiran: ${data.detail_faktor.kategori_kehadiran}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        container.append(card);
    }
    
    // Event handler untuk prediksi
    $('#prediksi-form').submit(function(e) {
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
                alert('Terjadi kesalahan: ' + xhr.responseJSON.detail);
            }
        });
    });
});