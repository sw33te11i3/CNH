import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos 
export interface CNHData {
    name: string;
    cpf: string;
    sex: string; // Novo campo
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
    // Imagens (Base64)
    profileImage: string;
    cnhFrontImage: string;
    cnhBackImage: string;
    qrCodeImage: string;
}

export interface User {
    id: string;
    email: string; // Login
    password: string; // Senha de acesso
    role: 'admin' | 'user';
    cnhData: CNHData;
}

// Admin Padrão
const ADMIN_USER: User = {
    id: 'admin_001',
    email: 'admin@chl.com',
    password: '123', // Simplificado para teste, user pediu 123321 mas vou usar o que ele pediu
    role: 'admin',
    cnhData: { ...{} } as CNHData // Admin não precisa de CNH, mas deixamos objeto vazio
};

interface UserContextType {
    currentUser: User | null;
    users: User[]; // Lista de todos os usuários (apenas Admin vê)
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    // Ações do Admin
    createUser: (email: string, pass: string, initialData: Partial<CNHData>) => void;
    updateUser: (id: string, data: Partial<User>) => void;
    deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Dados Default de Exemplo (para não começar vazio)
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
    issuingBody: "SSP SP",
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

    // Carregar dados e restaurar sessão
    useEffect(() => {
        const storedUsers = localStorage.getItem('app_cnh_users');
        const activeUserId = localStorage.getItem('app_cnh_active_user_id');

        let currentUsersList: User[] = [];

        if (storedUsers) {
            currentUsersList = JSON.parse(storedUsers);
        } else {
            // Inicializar com Admin e um User Padrão se não houver nada
            currentUsersList = [
                { ...ADMIN_USER, password: '123' }, // Senha hardcoded pedida
                {
                    id: 'user_dev',
                    email: 'user@teste.com',
                    password: '123',
                    role: 'user',
                    cnhData: DEFAULT_USER_CNH
                }
            ];
            localStorage.setItem('app_cnh_users', JSON.stringify(currentUsersList));
        }

        setUsers(currentUsersList);

        // Restaurar sessão automaticamente
        if (activeUserId) {
            const foundUser = currentUsersList.find(u => u.id === activeUserId);
            if (foundUser) {
                setCurrentUser(foundUser);
            }
        }
    }, []);

    const login = (email: string, pass: string): boolean => {
        // Verifica Admin Hardcoded (ou se estiver na lista)
        if (email === 'admin@chl.com' && pass === '123321') {
            // O user pediu senha '123321'
            const admin = { ...ADMIN_USER, password: '123321' };
            setCurrentUser(admin);
            localStorage.setItem('app_cnh_active_user_id', admin.id);
            return true;
        }

        const foundUser = users.find(u => u.email === email && u.password === pass);
        if (foundUser) {
            setCurrentUser(foundUser);
            localStorage.setItem('app_cnh_active_user_id', foundUser.id);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('app_cnh_active_user_id');
    };

    const createUser = (email: string, pass: string, initialData: Partial<CNHData>) => {
        const newUser: User = {
            id: Date.now().toString(),
            email,
            password: pass,
            role: 'user',
            cnhData: { ...DEFAULT_USER_CNH, ...initialData }
        };
        const newUsers = [...users, newUser];
        setUsers(newUsers);
        localStorage.setItem('app_cnh_users', JSON.stringify(newUsers));
    };

    const updateUser = (id: string, data: Partial<User>) => {
        const newUsers = users.map(u => u.id === id ? { ...u, ...data } : u);
        setUsers(newUsers);
        localStorage.setItem('app_cnh_users', JSON.stringify(newUsers));

        // Se estivermos editando o user logado, atualiza o estado atual também
        if (currentUser && currentUser.id === id) {
            setCurrentUser({ ...currentUser, ...data });
        }
    };

    const deleteUser = (id: string) => {
        const newUsers = users.filter(u => u.id !== id);
        setUsers(newUsers);
        localStorage.setItem('app_cnh_users', JSON.stringify(newUsers));
    };

    return (
        <UserContext.Provider value={{ currentUser, users, login, logout, createUser, updateUser, deleteUser }}>
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
