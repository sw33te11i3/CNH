import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Tipos 
export interface CNHData {
    name: string;
    cpf: string;
    sex: string;
    birthDate: string;
    fatherName: string;
    motherName: string;
    category: string;
    registerNumber: string;
    validityDate: string;
    firstLicenseDate: string;
    issueDate: string;
    issuePlace: string;
    issuingBody: string;
    observation: string;
    scores: number;
    // Imagens (URLs do Supabase Storage)
    profileImage: string;
    cnhFrontImage: string;
    cnhBackImage: string;
    qrCodeImage: string;
}

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    cnhData: CNHData;
}

interface UserContextType {
    currentUser: User | null;
    users: User[];
    loading: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
    createUser: (email: string, pass: string, initialData: Partial<CNHData>) => Promise<void>;
    updateUser: (id: string, data: Partial<User & { cnhData?: Partial<CNHData> }>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    uploadImage: (file: File, path: string) => Promise<string>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER_CNH: CNHData = {
    name: "GABRIEL DE CARVALHO ALMEIDA",
    cpf: "065.494.269-28",
    sex: "MASCULINO",
    birthDate: "19/03/1989",
    fatherName: "ALCIDES DE ALMEIDA",
    motherName: "KARIN CHRISTINA DE CARVALHO",
    category: "AB",
    registerNumber: "04133666168",
    validityDate: "01/09/2032",
    firstLicenseDate: "27/06/2007",
    issueDate: "02/09/2022",
    issuePlace: "SC",
    issuingBody: "SSP SC", // Alterado SSP SP para SSP SC conforme UF
    observation: "-",
    scores: 40,
    profileImage: "",
    cnhFrontImage: "",
    cnhBackImage: "",
    qrCodeImage: "",
};

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const mapProfileToUser = (profile: any): User => ({
        id: profile.id,
        email: profile.email,
        role: profile.role || 'user',
        cnhData: {
            name: profile.name || '',
            cpf: profile.cpf || '',
            sex: profile.sex || '',
            birthDate: profile.birth_date || '',
            fatherName: profile.father_name || '',
            motherName: profile.mother_name || '',
            category: profile.category || '',
            registerNumber: profile.register_number || '',
            validityDate: profile.validity_date || '',
            firstLicenseDate: profile.first_license_date || '',
            issueDate: profile.issue_date || '',
            issuePlace: profile.issue_place || '',
            issuingBody: profile.issuing_body || '',
            observation: profile.observation || '',
            scores: profile.scores || 0,
            profileImage: profile.profile_image_url || '',
            cnhFrontImage: profile.cnh_front_image_url || '',
            cnhBackImage: profile.cnh_back_image_url || '',
            qrCodeImage: profile.qr_code_image_url || '',
        }
    });

    const refreshUsersList = async () => {
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data) {
            setUsers(data.map(mapProfileToUser));
        }
    };

    useEffect(() => {
        // Restaurar sessão do Auth
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    setCurrentUser(mapProfileToUser(profile));
                }
            }
            if (session?.user?.id) {
                // Se for admin, carrega todos
                const { data: roleCheck } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
                if (roleCheck?.role === 'admin') {
                    await refreshUsersList();
                }
            }
            setLoading(false);
        };

        initSession();

        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) setCurrentUser(mapProfileToUser(profile));
                if (profile?.role === 'admin') await refreshUsersList();
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
                setUsers([]);
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        return !error && !!data.user;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const uploadImage = async (file: File, path: string): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('cnh-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('cnh-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const createUser = async (email: string, pass: string, initialData: Partial<CNHData>) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pass });
        if (authError) throw authError;

        if (authData.user) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: authData.user.id,
                email,
                name: initialData.name || '',
                cpf: initialData.cpf || '',
                ...initialData
            });
            if (profileError) throw profileError;
            await refreshUsersList();
        }
    };

    const updateUser = async (id: string, data: Partial<User & { cnhData?: Partial<CNHData> }>) => {
        const updates: any = {};
        if (data.email) updates.email = data.email;
        if (data.role) updates.role = data.role;
        
        if (data.cnhData) {
            const cnh = data.cnhData;
            if (cnh.name !== undefined) updates.name = cnh.name;
            if (cnh.cpf !== undefined) updates.cpf = cnh.cpf;
            if (cnh.sex !== undefined) updates.sex = cnh.sex;
            if (cnh.birthDate !== undefined) updates.birth_date = cnh.birthDate;
            if (cnh.category !== undefined) updates.category = cnh.category;
            if (cnh.validityDate !== undefined) updates.validity_date = cnh.validityDate;
            if (cnh.issueDate !== undefined) updates.issue_date = cnh.issueDate;
            if (cnh.issuePlace !== undefined) updates.issue_place = cnh.issuePlace;
            if (cnh.profileImage !== undefined) updates.profile_image_url = cnh.profileImage;
            if (cnh.cnhFrontImage !== undefined) updates.cnh_front_image_url = cnh.cnhFrontImage;
            if (cnh.cnhBackImage !== undefined) updates.cnh_back_image_url = cnh.cnhBackImage;
            if (cnh.qrCodeImage !== undefined) updates.qr_code_image_url = cnh.qrCodeImage;
        }

        const { error } = await supabase.from('profiles').update(updates).eq('id', id);
        if (error) throw error;

        if (currentUser?.id === id) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (profile) setCurrentUser(mapProfileToUser(profile));
        }
        await refreshUsersList();
    };

    const deleteUser = async (id: string) => {
        // Nota: Auth users devem ser deletados via admin API ou trigger, aqui deletamos apenas o profile
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        await refreshUsersList();
    };

    return (
        <UserContext.Provider value={{ currentUser, users, loading, login, logout, createUser, updateUser, deleteUser, uploadImage }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
