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
    uploadImage: (file: File, path: string, oldUrl?: string) => Promise<string>;
    refreshUsersList: () => Promise<void>;
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
        try {
            console.log('Iniciando refreshUsersList...');
            // Timeout de 5 segundos para não travar o app se o Supabase demorar
            const fetchPromise = supabase.from('profiles').select('*');
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout ao buscar usuários')), 5000)
            );

            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

            if (error) {
                console.error('Erro ao buscar lista de usuários:', error);
                // Log detalhado do erro PostgREST
                if (error.message) console.error('Mensagem PostgREST:', error.message);
                if (error.details) console.error('Detalhes PostgREST:', error.details);
                return;
            }
            if (data) {
                setUsers(data.map(mapProfileToUser));
                console.log('Lista de usuários atualizada:', data.length);
                if (data.length > 0) {
                    console.log('--- DB SCHEMA CHECK (First User Row) ---');
                    console.log('Columns found:', Object.keys(data[0]));
                    console.log('Values found:', data[0]);
                    console.log('-----------------------------------------');
                }
            }
        } catch (err) {
            console.warn('Falha no refreshUsersList (silenciosa):', err);
        }
    };

    useEffect(() => {
        // Restaurar sessão do Auth
        const initSession = async () => {
            const timeoutId = setTimeout(() => {
                setLoading(prev => {
                    if (prev) {
                        console.warn('Sessão demorando muito para carregar... liberando interface.');
                        return false;
                    }
                    return false;
                });
            }, 6000);

            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (session?.user) {
                    console.log('Sessão ativa encontrada para UID:', session.user.id);
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) {
                        console.warn('Erro ao buscar perfil (initSession):', profileError);
                        if (profileError.message) console.error('Mensagem:', profileError.message);
                        if (profileError.details) console.error('Detalhes:', profileError.details);
                    } else if (profile) {
                        console.log('Perfil carregado com sucesso:', profile.name);
                        setCurrentUser(mapProfileToUser(profile));

                        if (profile.role === 'admin') {
                            await refreshUsersList();
                        }
                    } else {
                        console.warn('Nenhum perfil encontrado para o usuário logado (initSession).');
                    }
                } else {
                    console.log('Nenhuma sessão ativa encontrada (initSession).');
                }
            } catch (err: any) {
                console.error('Erro crítico na inicialização da sessão:', err.message);
            } finally {
                clearTimeout(timeoutId);
                setLoading(false);
            }
        };

        initSession();

        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Erro ao buscar perfil após login:', profileError);
                    return;
                }

                if (profile) {
                    console.log('Perfil sincronizado após Auth Change:', profile.name);
                    const user = mapProfileToUser(profile);
                    setCurrentUser(user);
                    if (user.role === 'admin') {
                        await refreshUsersList();
                    }
                } else {
                    console.warn('Evento SIGNED_IN detectado, mas perfil não encontrado para UID:', session.user.id);
                }
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

        // Mapeamento explícito das imagens
        if (data.profileImage !== undefined) updates.profile_image_url = data.profileImage;
        if (data.cnhFrontImage !== undefined) updates.cnh_front_image_url = data.cnhFrontImage;
        if (data.cnhBackImage !== undefined) updates.cnh_back_image_url = data.cnhBackImage;
        if (data.qrCodeImage !== undefined) updates.qr_code_image_url = data.qrCodeImage;

        console.log('mapCNHToDB Result:', updates);
        return updates;
    };

    const normalizeIdentifier = (id: string) => {
        const clean = id.trim();
        if (clean.includes('@')) return clean.toLowerCase();
        // Se parece CPF (apenas números ou com máscara), vira e-mail fake
        const onlyNumbers = clean.replace(/\D/g, '');
        if (onlyNumbers.length === 11) return `${onlyNumbers}@cnhbr.com.br`;
        return clean.toLowerCase();
    };

    const login = async (identifier: string, pass: string): Promise<boolean> => {
        const email = normalizeIdentifier(identifier);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

        if (error || !data.user) return false;

        // Força a atualização do currentUser e da lista se for admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profile) {
            const user = mapProfileToUser(profile);
            setCurrentUser(user);
            if (user.role === 'admin') {
                await refreshUsersList();
            }
        }

        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const uploadImage = async (file: File, path: string, oldUrl?: string): Promise<string> => {
        // Se houver uma URL antiga, tenta extrair o caminho e deletar
        if (oldUrl) {
            try {
                // Exemplo de URL: https://upctnkochhwuwwjcdcaa.supabase.co/storage/v1/object/public/cnh-images/profileImage/0.123.jpg
                // Precisamos do caminho relativo dentro do bucket: profileImage/0.123.jpg
                const pathParts = oldUrl.split('/cnh-images/');
                if (pathParts.length > 1) {
                    const relativePath = pathParts[1];
                    await supabase.storage
                        .from('cnh-images')
                        .remove([relativePath]);
                }
            } catch (err) {
                console.warn('Falha ao deletar imagem antiga:', err);
                // Não trava o processo se falhar ao deletar a antiga
            }
        }

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
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    role: 'user' // Metadata opcional
                }
            }
        });

        if (authError) throw authError;

        // Se o usuário foi criado mas não há sessão, pode ser que 'Email Confirmation' esteja ligado no Supabase
        if (!authData.session && authData.user) {
            alert('Usuário criado, mas aguardando confirmação de e-mail (ou habilitado manual no painel). Verifique as configurações de E-mail Auth no Supabase.');
        }

        if (authData.user) {
            const dbData = {
                id: authData.user.id,
                email,
                ...mapCNHToDB(DEFAULT_USER_CNH),
                ...mapCNHToDB(initialData)
            };

            const { error: profileError } = await supabase.from('profiles').insert(dbData);
            if (profileError) {
                // Se der erro aqui, o usuário no Auth já existe, mas o perfil não.
                console.error('Erro ao criar perfil:', profileError);
                throw new Error('Usuário autenticado criado, mas erro ao salvar perfil: ' + profileError.message);
            }
            await refreshUsersList();
        } else {
            throw new Error('Não foi possível criar o usuário. Verifique se ele já existe.');
        }
    };

    const updateUser = async (id: string, data: Partial<User & { cnhData?: Partial<CNHData> }>) => {
        console.log('--- UPDATE START ---');
        console.log('Target ID:', id);
        console.log('Update Data:', data);

        const updates: any = {};
        if (data.email) updates.email = normalizeIdentifier(data.email);
        if (data.role) updates.role = data.role;

        if (data.cnhData) {
            const cnhUpdates = mapCNHToDB(data.cnhData);
            Object.assign(updates, cnhUpdates);
        }

        console.log('Payload for Supabase:', updates);

        // Usamos .select() para confirmar se a linha foi realmente alterada e o que o DB salvou
        const { data: updatedRows, error, status } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Erro no Supabase update:', error);
            throw error;
        }

        console.log('HTTP Status:', status);
        console.log('Updated Rows:', updatedRows);

        if (!updatedRows || updatedRows.length === 0) {
            console.error('ALERTA: Nenhuma linha foi alterada! O ID não existe ou o RLS impediu o update.');
            throw new Error('Nenhuma alteração foi salva no banco de dados. Verifique as permissões.');
        }

        console.log('Update bem-sucedido. Dados retornados do DB:', updatedRows[0]);

        if (currentUser?.id === id) {
            setCurrentUser(mapProfileToUser(updatedRows[0]));
        }
        await refreshUsersList();
        console.log('--- UPDATE END ---');
    };

    const deleteUser = async (id: string) => {
        // 1. Busca os dados para pegar URLs das imagens antes de deletar o perfil
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();

        if (profile) {
            // 2. Coleta todos os caminhos de imagem para deletar do Storage
            const imagesToDelete = [
                profile.profile_image_url,
                profile.cnh_front_image_url,
                profile.cnh_back_image_url,
                profile.qr_code_image_url
            ].filter(url => url && url.includes('/cnh-images/'))
                .map(url => url.split('/cnh-images/')[1]);

            if (imagesToDelete.length > 0) {
                await supabase.storage.from('cnh-images').remove(imagesToDelete);
            }
        }

        // 3. Deleta o profile (Auth user deve ser deletado via Admin ou Cascade se configurado)
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        await refreshUsersList();
    };

    return (
        <UserContext.Provider value={{ currentUser, users, loading, login, logout, createUser, updateUser, deleteUser, uploadImage, refreshUsersList }}>
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
