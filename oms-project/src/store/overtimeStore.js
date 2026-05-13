import { ref } from 'vue'

export const pmList = ref([
    "Luhut Binsar Pandjaitan",
    "Gibran Rakabuming Raka",
    "Joko Widodo",
    "Prabowo Subianto",
])

export const overtimeList = ref([
    {
        task: 'Debugging',
        date: new Date(2026, 3, 24),
        hours: 7,
        status: 'Pending',
        jamMulai: '19:00',
        jenis: 'Bug Fixing',
        pic: 'Luhut Binsar Pandjaitan',
        desc: 'Investigasi dan perbaikan critical bug pada endpoint autentikasi yang menyebabkan gagal login pada sejumlah user di environment production.'
    },
    {
        task: 'Deployment',
        date: new Date(2026, 3, 23),
        hours: 5,
        status: 'Approved',
        jamMulai: '19:30',
        jenis: 'Deployment',
        pic: 'Gibran Rakabuming Raka',
        desc: 'Deploy versi 2.4.1 ke production server, mencakup migrasi database schema, konfigurasi environment variable, dan validasi rollback plan.'
    },
    {
        task: 'Developing',
        date: new Date(2026, 3, 20),
        hours: 4,
        status: 'Approved',
        jamMulai: '20:00',
        jenis: 'Feature Development',
        pic: 'Joko Widodo',
        desc: 'Pengembangan fitur notifikasi real-time menggunakan WebSocket untuk modul overtime management, termasuk unit test dan dokumentasi.'
    },
    {
        task: 'Testing',
        date: new Date(2026, 3, 18),
        hours: 4,
        status: 'Declined',
        jamMulai: '19:00',
        jenis: 'QA Testing',
        pic: 'Prabowo Subianto',
        desc: 'Regression testing untuk sprint 12, mencakup 45 test case pada modul approval dan reporting. Ditolak karena overlap jadwal dengan lembur sebelumnya.'
    },
    {
        task: 'Deployment',
        date: new Date(2026, 3, 15),
        hours: 5,
        status: 'Pending',
        jamMulai: '21:00',
        jenis: 'Deployment',
        pic: 'Gibran Rakabuming Raka',
        desc: 'Hotfix deployment untuk patch keamanan pada dependency library yang teridentifikasi memiliki celah keamanan kritikal di environment production.'
    },
    {
        task: 'Debugging',
        date: new Date(2026, 3, 11),
        hours: 6,
        status: 'Approved',
        jamMulai: '19:00',
        jenis: 'Bug Fixing',
        pic: 'Prabowo Subianto',
        desc: 'Debug performa query database yang lambat pada halaman laporan bulanan. Ditemukan missing index pada tabel overtime_requests, dilakukan optimasi query plan.'
    },
    {
        task: 'Deployment',
        date: new Date(2026, 3, 9),
        hours: 8,
        status: 'Approved',
        jamMulai: '20:00',
        jenis: 'Deployment',
        pic: 'Luhut Binsar Pandjaitan',
        desc: 'Major release v3.0.0 menggunakan strategi blue-green deployment. Meliputi zero-downtime deployment, konfigurasi load balancer, dan smoke testing post-deploy.'
    },
    {
        task: 'Debugging',
        date: new Date(2026, 3, 7),
        hours: 6,
        status: 'Approved',
        jamMulai: '19:00',
        jenis: 'Bug Fixing',
        pic: 'Prabowo Subianto',
        desc: 'Perbaikan bug pada fitur export PDF laporan lembur. Issue terletak pada library rendering yang tidak kompatibel dengan data format tertentu.'
    },
    {
        task: 'Code Review',
        date: new Date(2026, 3, 5),
        hours: 3,
        status: 'Approved',
        jamMulai: '19:30',
        jenis: 'Code Review',
        pic: 'Luhut Binsar Pandjaitan',
        desc: 'Review pull request dari 2 developer junior mencakup 10 file dan sekitar 600 baris perubahan kode pada modul form pengajuan lembur.'
    },
    {
        task: 'Bug Fix',
        date: new Date(2026, 3, 2),
        hours: 4,
        status: 'Pending',
        jamMulai: '20:00',
        jenis: 'Bug Fixing',
        pic: 'Gibran Rakabuming Raka',
        desc: 'Fix issue pada validasi form pengajuan lembur dimana durasi tidak terhitung dengan benar saat jam mulai melewati tengah malam.'
    }
])
