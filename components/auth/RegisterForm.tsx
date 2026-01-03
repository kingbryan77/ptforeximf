import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { EnvelopeIcon, LockClosedIcon, PhoneIcon, UserIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [needsVerification, setNeedsVerification] = useState(false);

  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = 'Nama Lengkap wajib diisi.';
    if (!email) newErrors.email = 'Email wajib diisi.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid.';
    if (!phoneNumber) newErrors.phoneNumber = 'Nomor Telepon wajib diisi.';
    if (!password) newErrors.password = 'Password wajib diisi.';
    else if (password.length < 6) newErrors.password = 'Password minimal 6 karakter.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Konfirmasi password tidak cocok.';
    if (!agreeTerms) newErrors.agreeTerms = 'Anda harus menyetujui Syarat & Ketentuan.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const userData: Omit<User, 'id' | 'username' | 'isAdmin' | 'isVerified' | 'balance' | 'notifications' | 'profilePictureUrl'> & { password: string } = {
      fullName,
      email,
      phoneNumber,
      password,
    };

    const success = await register(userData);
    if (success) {
      setNeedsVerification(true);
    }
  };

  if (needsVerification) {
    return (
      <div className="text-center animate-fade-in py-8">
        <div className="bg-success/20 text-success p-6 rounded-2xl mb-6">
           <InformationCircleIcon className="w-16 h-16 mx-auto mb-4" />
           <h2 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h2>
           <p className="text-sm leading-relaxed">
             Silakan periksa kotak masuk email Anda (**{email}**) untuk mengonfirmasi akun sebelum login. 
             Jika link verifikasi tidak muncul, periksa folder Spam.
           </p>
        </div>
        <Link to="/" className="text-primary font-bold hover:underline">
          Kembali ke Halaman Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          FOREX<span className="text-blue-500">imf</span>
        </h1>
        <p className="text-gray-300 mt-1 text-xs tracking-wider">TRADING LIKE A PRO</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Buat Akun Baru</h2>
      <p className="text-gray-400 mb-6 text-sm">Mulai trading dengan broker terpercaya</p>

      {(errors.api || error) && (
        <div className="bg-danger/20 text-danger p-3 rounded-lg mb-4 text-xs font-medium border border-danger/30">
          {errors.api || error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          id="fullName"
          label="Nama Lengkap"
          placeholder="Contoh: Budi Santoso"
          icon={<UserIcon />}
          value={fullName}
          onChange={(e) => { setFullName(e.target.value); setErrors({}); }}
          error={errors.fullName}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="budi@example.com"
          icon={<EnvelopeIcon />}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
          error={errors.email}
        />
        <Input
          id="phoneNumber"
          label="Nomor Telepon"
          type="tel"
          placeholder="08123456789"
          icon={<PhoneIcon />}
          value={phoneNumber}
          onChange={(e) => { setPhoneNumber(e.target.value); setErrors({}); }}
          error={errors.phoneNumber}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Minimal 6 karakter"
          icon={<LockClosedIcon />}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
          error={errors.password}
        />
        <Input
          id="confirmPassword"
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          icon={<LockClosedIcon />}
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
          error={errors.confirmPassword}
        />
      </div>

      <div className="flex items-center mt-6 mb-6 text-xs">
        <input
          id="agreeTerms"
          type="checkbox"
          className="form-checkbox h-4 w-4 text-primary bg-darkblue2 border-gray-700 rounded focus:ring-primary"
          checked={agreeTerms}
          onChange={(e) => { setAgreeTerms(e.target.checked); setErrors({}); }}
        />
        <label htmlFor="agreeTerms" className="ml-2 text-gray-400">
          Saya menyetujui <a href="#" className="text-primary hover:underline">Syarat & Ketentuan</a> yang berlaku.
        </label>
        {errors.agreeTerms && <p className="ml-2 text-danger font-bold">{errors.agreeTerms}</p>}
      </div>

      <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading}>
        Daftar Sekarang
      </Button>

      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-700" />
        <span className="px-3 text-gray-500 text-[10px] tracking-widest font-bold">ATAU</span>
        <hr className="flex-grow border-gray-700" />
      </div>

      <p className="text-gray-400 text-sm text-center">
        Sudah punya akun?{' '}
        <Link to="/" className="text-primary hover:underline font-bold">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;