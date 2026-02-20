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
    issuingBody: "SSP SC",
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

    const mapCNHToDB = (data: Partial<CNHData>) => {
        const updates: any = {};
        if (data.name !== undefined) updates.name = data.name;
        if (data.cpf !== undefined) updates.cpf = data.cpf;
        if (data.sex !== undefined) updates.sex = data.sex;
        if (data.birthDate !== undefined) updates.birth_date = data.birthDate;
        if (data.fatherName !== undefined) updates.father_name = data.fatherName;
        if (data.motherName !== undefined) updates.mother_name = data.motherName;
        if (data.category !== undefined) updates.category = data.category;
        if (data.registerNumber !== undefined) updates.register_number = data.registerNumber;
        if (data.validityDate !== undefined) updates.validity_date = data.validityDate;
        if (data.firstLicenseDate !== undefined) updates.first_license_date = data.firstLicenseDate;
        if (data.issueDate !== undefined) updates.issue_date = data.issueDate;
        if (data.issuePlace !== undefined) updates.issue_place = data.issuePlace;
        if (data.issuingBody !== undefined) updates.issuing_body = data.issuingBody;
        if (data.observation !== undefined) updates.observation = data.observation;
        if (data.scores !== undefined) updates.scores = data.scores;
        if (data.profileImage !== undefined) updates.profile_image_url = data.profileImage;
        if (data.cnhFrontImage !== undefined) updates.cnh_front_image_url = data.cnhFrontImage;
        if (data.cnhBackImage !== undefined) updates.cnh_back_image_url = data.cnhBackImage;
        if (data.qrCodeImage !== undefined) updates.qr_code_image_url = data.qrCodeImage;
        return updates;
    };

    const normalizeIdentifier = (id: string) => {
        const clean = id.trim();
        if (clean.includes('@')) return clean.toLowerCase();
        // Se parece CPF (apenas números ou com máscara), vira e-mail fake
        const onlyNumbers = clean.replace(/\D/g, '');
        if (onlyNumbers.length === 11) return `${onlyNumbers}@app.cnh`;
        return clean.toLowerCase();
    };

    const login = async (identifier: string, pass: string): Promise<boolean> => {
        const email = normalizeIdentifier(identifier);
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

    const createUser = async (identifier: string, pass: string, initialData: Partial<CNHData>) => {
        const email = normalizeIdentifier(identifier);
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: pass });
        if (authError) throw authError;

        if (authData.user) {
            const dbData = {
                id: authData.user.id,
                email,
                ...mapCNHToDB(DEFAULT_USER_CNH),
                ...mapCNHToDB(initialData)
            };

            const { error: profileError } = await supabase.from('profiles').insert(dbData);
            if (profileError) throw profileError;
            await refreshUsersList();
        }
    };

    const updateUser = async (id: string, data: Partial<User & { cnhData?: Partial<CNHData> }>) => {
        const updates: any = {};
        if (data.email) updates.email = normalizeIdentifier(data.email);
        if (data.role) updates.role = data.role;

        if (data.cnhData) {
            Object.assign(updates, mapCNHToDB(data.cnhData));
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
