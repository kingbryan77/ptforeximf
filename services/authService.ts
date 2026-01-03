import { User, UserProfileUpdate } from '../types';
import { supabase } from './supabaseClient';

const mapProfileToUser = (profile: any, authUser: any): User => {
  return {
    id: authUser?.id || profile?.id,
    email: profile.email || authUser?.email || '',
    fullName: profile.full_name || '',
    username: profile.username || '',
    phoneNumber: profile.phone_number || '',
    isAdmin: profile.is_admin || false,
    isVerified: profile.is_verified || false,
    balance: profile.balance || 0,
    notifications: [], 
    profilePictureUrl: profile.profile_picture_url,
  };
};

export const register = async (userData: Omit<User, 'id' | 'username' | 'isAdmin' | 'isVerified' | 'balance' | 'notifications' | 'profilePictureUrl'> & { password: string }): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName,
        }
      }
    });

    if (authError) return { user: null, error: authError.message };
    if (!authData.user) return { user: null, error: 'Gagal membuat akun.' };

    // Tunggu sejenak agar trigger SQL selesai membuat record di tabel profiles
    await new Promise(r => setTimeout(r, 1000));

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return { user: mapProfileToUser(profileData || {}, authData.user), error: null };
  } catch (e: any) {
    return { user: null, error: e.message || 'Terjadi kesalahan sistem.' };
  }
};

export const login = async (identifier: string, passwordAttempt: string): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: passwordAttempt,
    });

    if (authError) return { user: null, error: authError.message };
    if (!authData.user) return { user: null, error: 'User tidak ditemukan.' };

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) return { user: null, error: 'Profil tidak ditemukan. Pastikan email sudah diverifikasi.' };

    return { user: mapProfileToUser(profileData, authData.user), error: null };
  } catch (e: any) {
    return { user: null, error: e.message };
  }
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profileData) return null;

    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    const user = mapProfileToUser(profileData, session.user);
    user.notifications = notifs || [];
    
    return user;
  } catch {
    return null;
  }
};

export const updateUserNotification = async (userId: string, notificationId: string, read: boolean): Promise<void> => {
  await supabase.from('notifications').update({ read }).eq('id', notificationId).eq('user_id', userId);
};

export const addUserNotification = async (userId: string, message: string): Promise<void> => {
  await supabase.from('notifications').insert([{ user_id: userId, message, date: new Date().toISOString(), read: false }]);
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId);
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return profiles.map((p: any) => mapProfileToUser(p, null));
};

export const updateUserInfo = async (updatedData: Partial<User>): Promise<void> => {
  if (!updatedData.id) return;
  const updates: any = {};
  if (updatedData.fullName) updates.full_name = updatedData.fullName;
  if (updatedData.phoneNumber) updates.phone_number = updatedData.phoneNumber;
  if (updatedData.profilePictureUrl) updates.profile_picture_url = updatedData.profilePictureUrl;
  if (updatedData.isVerified !== undefined) updates.is_verified = updatedData.isVerified;
  await supabase.from('profiles').update(updates).eq('id', updatedData.id);
};

export const adminCreateUser = async (userData: Omit<User, 'id' | 'username' | 'notifications'> & { password: string }): Promise<User | null> => {
  try {
    // 1. Buat user di Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email: userData.email, 
        password: userData.password,
        options: { data: { full_name: userData.fullName } } 
    });
    
    if (authError || !authData.user) throw authError;

    // 2. Tunggu trigger SQL membuat profile (biasanya instan, tapi kita beri jeda sedikit)
    await new Promise(r => setTimeout(r, 1200));

    // 3. Update data tambahan yang tidak dihandle trigger otomatis (admin, balance, verification)
    const { data: profileData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
            is_admin: userData.isAdmin || false, 
            is_verified: userData.isVerified || false, 
            balance: userData.balance || 0,
            phone_number: userData.phoneNumber || ''
        })
        .eq('id', authData.user.id)
        .select()
        .single();

    if (updateError) throw updateError;

    // 4. Kirim notifikasi selamat datang
    await addUserNotification(authData.user.id, `Akun Anda telah dibuat oleh Administrator. Selamat bergabung!`);

    return mapProfileToUser(profileData, authData.user);
  } catch (err) { 
    console.error("Admin Create User Error:", err);
    return null; 
  }
};

export const verifyEmail = async (email: string) => true;
