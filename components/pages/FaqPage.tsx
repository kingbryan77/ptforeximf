import React, { useState } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "Apa saja biaya tambahannya?",
    answer: "Setiap member yang sudah take profit di kenakan biaya bagi hasil untuk perusahaan FOREXimf sebesar 30%"
  },
  {
    question: "Kapan pasar dibuka untuk perdagangan investasi?",
    answer: "Pasar valas buka 24 jam setiap hari di beberapa bagian dunia, mulai dari pukul 5 sore EST pada hari Minggu hingga pukul 4 sore EST pada hari Jumat. Fleksibilitas valas untuk berdagang investasi lebih dari 24 jam sebagian disebabkan oleh perbedaan zona waktu internasional."
  },
  {
    question: "Bagaimana cara mengelola risiko saya?",
    answer: "Limit order dan stop-loss order adalah alat manajemen risiko yang paling umum dalam investasi perdagangan valas. Limit order membantu membatasi harga minimum yang akan diterima atau harga maksimum yang akan dipesan. Stop-loss order digunakan untuk menetapkan posisi yang akan dilikuidasi secara tidak sukarela pada harga saat ini guna membatasi kemungkinan kerugian yang mungkin terjadi akibat pergerakan pasar terhadap posisi investor."
  },
  {
    question: "Jenis akun apa yang Anda tawarkan?",
    answer: "Kami memiliki beragam jenis akun. Anda dapat menjelajahi berbagai jenis akun di sini dan memilih yang paling sesuai untuk Anda."
  },
  {
    question: "Apakah ada volume investasi perdagangan minimum?",
    answer: "Anda dapat berdagang dengan modal hanya beberapa dolar saja menggunakan akun mikro kami."
  },
  {
    question: "Apa itu spread?",
    answer: "Spread adalah perbedaan antara harga bid dan ask mata uang dasar."
  },
  {
    question: "Bagaimana cara membuka akun investasi perdagangan?",
    answer: "Anda dapat membuka dua jenis akun: akun demo dan akun live. Di akun demo, Anda akan mendapatkan uang virtual yang dapat Anda gunakan untuk berdagang dan belajar secara virtual. Di akun live, Anda perlu menyetor dana terlebih dahulu untuk berdagang dan berinvestasi."
  },
  {
    question: "Bagaimana cara masuk ke platform investasi perdagangan?",
    answer: "Setelah mendaftar, Anda akan mendapatkan nama pengguna dan kata sandi yang dapat Anda gunakan untuk masuk ke akun Anda."
  },
  {
    question: "Berapa banyak akun yang dapat saya buka?",
    answer: "FOREXimf (Daxtradefx) menawarkan tiga mata uang dasar untuk Anda perdagangkan dan investasikan. Anda dapat memiliki beberapa akun untuk setiap mata uang dasar."
  },
  {
    question: "Leverage apa yang diterapkan pada akun saya?",
    answer: "Akun Anda dapat memiliki leverage maksimum 1:1000."
  },
  {
    question: "Bagaimana cara memverifikasi akun saya?",
    answer: "Untuk memverifikasi akun Anda, Anda perlu menyerahkan tanda pengenal yang dikeluarkan pemerintah dan bukti alamat."
  },
  {
    question: "Bagaimana saya dapat menyetorkan dana ke akun saya?",
    answer: "Pertama, Anda perlu memeriksa dokumen keamanan dan identifikasi kami, lalu Anda dapat menyetor dana ke akun Anda menggunakan berbagai metode berbeda termasuk transfer bank, bitcoin, dan masih banyak lagi."
  },
  {
    question: "Bagaimana saya bisa menarik uang?",
    answer: "Untuk melakukannya, Anda perlu mengisi dokumen keamanan dan identifikasi kami dan memilih jumlah yang ingin Anda tarik."
  },
  {
    question: "Apakah Anda menawarkan akun Islami?",
    answer: "Ya, kami menawarkannya."
  },
  {
    question: "Spread apa yang Anda tawarkan?",
    answer: "Kami menawarkan variabel spread yang bisa serendah 0,0 pip. Kami tidak melakukan re-quote: klien kami menerima nilai langsung dari sistem kami."
  },
  {
    question: "Leverage apa yang Anda tawarkan?",
    answer: "Leverage yang ditawarkan untuk akun perdagangan hingga 1:1000 tergantung pada jenis akun."
  },
  {
    question: "Apakah Anda mengizinkan scalping?",
    answer: "Ya, kami mengizinkan scalping."
  },
  {
    question: "Apa itu stop loss?",
    answer: "Stop-loss adalah perintah untuk menutup posisi yang telah dibuka sebelumnya pada harga yang kurang menguntungkan bagi klien dibandingkan harga saat stop-loss ditempatkan. Stop-loss bisa berupa batas yang Anda tetapkan untuk pesanan Anda. Setelah batas ini tercapai, pesanan Anda akan ditutup. Titik stop loss selalu ditetapkan di bawah harga saat ini untuk BELI, atau di atas harga ASK saat ini untuk JUAL."
  },
  {
    question: "Apakah Anda mengizinkan lindung nilai (hedging)?",
    answer: "Ya, kami melakukannya. Anda bebas melakukan lindung nilai atas posisi Anda di akun investasi trading Anda. Lindung nilai dilakukan setelah Anda membuka posisi panjang dan pendek pada instrumen yang sama secara bersamaan. Setelah Anda membuka posisi BELI dan JUAL pada instrumen yang sama dan dalam ukuran lot yang sama, marginnya adalah 0. Margin CFD, setelah Anda melakukan perlindungan nilai, biasanya 50%."
  },
  {
    question: "Bisakah saya mengubah leverage saya? Jika ya, bagaimana caranya?",
    answer: "Ya, di tab Akun Saya (Settings), Anda dapat mengubah leverage, lalu tekan tombol Ubah Leverage di bagian Anggota kami. Itu adalah metode perubahan leverage instan."
  },
  {
    question: "Saya masih punya pertanyaan.",
    answer: "Untuk pertanyaan lebih lanjut, Anda dapat menghubungi kami melalui email dan nomor kontak kami."
  }
];

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
      <div className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2 border border-primary/20 shadow-lg shadow-primary/5">
            <QuestionMarkCircleIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Temukan jawaban atas pertanyaan umum seputar perdagangan, akun, dan layanan kami. 
          Kami di sini untuk membantu Anda berdagang selayaknya seorang profesional.
        </p>
      </div>

      <div className="space-y-4 pb-12">
        {FAQ_DATA.map((item, index) => (
          <div 
            key={index} 
            className={`rounded-xl overflow-hidden transition-all duration-300 border ${
              openIndex === index 
                ? 'bg-[#151922] border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/20' 
                : 'bg-darkblue2 border-gray-800 hover:border-gray-700 hover:bg-[#1A1F29]'
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none group"
            >
              <span className={`font-semibold text-sm sm:text-lg transition-colors duration-200 ${
                  openIndex === index ? 'text-primary' : 'text-gray-200 group-hover:text-white'
              }`}>
                {item.question}
              </span>
              <span className={`flex-shrink-0 ml-4 p-1.5 rounded-full transition-all duration-300 ${
                  openIndex === index ? 'bg-primary text-white rotate-180' : 'text-gray-400 bg-gray-800 group-hover:bg-gray-700'
              }`}>
                <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
              </span>
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-6 text-gray-300 text-sm sm:text-base leading-relaxed border-t border-gray-700/50 pt-4">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Contact Support CTA */}
      <div className="text-center mt-4 pb-8 border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm">
              Masih tidak menemukan jawaban? <span className="text-primary cursor-pointer hover:underline font-medium hover:text-blue-400 transition-colors">Hubungi Layanan Pelanggan</span>
          </p>
      </div>
    </div>
  );
};

export default FaqPage;