import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import type { User, CNHData } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit2, Upload, Users, Loader2 } from 'lucide-react';

export function AdminPanel() {
    const { users, logout, createUser, updateUser, deleteUser, uploadImage, loading } = useUser();
    const navigate = useNavigate();

    const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<User & CNHData & { password?: string }>>({});

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const startCreate = () => {
        setFormData({
            email: '',
            password: '',
            name: '',
            cpf: '',
            category: 'AB'
        });
        setView('create');
    };

    const startEdit = (user: User) => {
        setEditingId(user.id);
        setFormData({
            email: user.email,
            ...user.cnhData
        });
        setView('edit');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Separa dados de login de dados de CNH
            const { email, password, role, id, ...cnhData } = formData as any;

            if (view === 'create') {
                await createUser(email, password, cnhData);
            } else if (view === 'edit' && editingId) {
                await updateUser(editingId, { email, cnhData });
            }

            setView('list');
            setEditingId(null);
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof CNHData) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadingField(field);
            try {
                const url = await uploadImage(file, field);
                setFormData(prev => ({ ...prev, [field]: url }));
            } catch (error: any) {
                alert('Erro no upload: ' + error.message);
            } finally {
                setUploadingField(null);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

    if (view === 'list') {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Painel Dev Admin</h1>
                            <p className="text-gray-500">Gerenciar usuários e dados da CNH</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                            <LogOut size={20} /> Sair
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2"><Users size={20} /> Usuários Cadastrados</h3>
                            <button onClick={startCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                                <Plus size={18} /> Novo Usuário
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {users.map(user => (
                                <div key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-bold text-gray-800">{user.cnhData.name || 'Sem nome'}</p>
                                        <p className="text-sm text-gray-500">{user.email} • {user.role}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                                            <Edit2 size={18} />
                                        </button>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Tem certeza?')) deleteUser(user.id);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-6 border-b pb-2">
                    {view === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
                </h2>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Login Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">E-mail (Login)</label>
                            <input required type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border p-2 rounded" />
                        </div>
                        {view === 'create' && (
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Senha</label>
                                <input required type="password" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full border p-2 rounded" />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-gray-200 my-4" />

                    {/* Personal Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
                            <input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded uppercase" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CPF</label>
                            <input value={formData.cpf || ''} onChange={e => setFormData({ ...formData, cpf: e.target.value })} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
                            <input value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 rounded uppercase" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Validade</label>
                            <input value={formData.validityDate || ''} onChange={e => setFormData({ ...formData, validityDate: e.target.value })} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Emissão</label>
                            <input value={formData.issueDate || ''} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Sexo</label>
                            <input value={formData.sex || ''} onChange={e => setFormData({ ...formData, sex: e.target.value })} className="w-full border p-2 rounded uppercase" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">UF de Emissão</label>
                            <input value={formData.issuePlace || ''} onChange={e => setFormData({ ...formData, issuePlace: e.target.value })} className="w-full border p-2 rounded uppercase" />
                        </div>
                    </div>

                    <div className="h-px bg-gray-200 my-4" />

                    {/* Images Upload */}
                    <h3 className="font-bold text-gray-700">Imagens da CNH (Upload para Storage)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {['profileImage', 'cnhFrontImage', 'cnhBackImage', 'qrCodeImage'].map((field) => (
                            <div key={field} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleImageUpload(e, field as keyof CNHData)}
                                    disabled={uploadingField === field}
                                />
                                <div className="space-y-2">
                                    {uploadingField === field ? (
                                        <div className="flex flex-col items-center py-4">
                                            <Loader2 className="animate-spin text-blue-600 mb-2" />
                                            <p className="text-xs text-gray-500">Enviando...</p>
                                        </div>
                                    ) : formData[field as keyof CNHData] ? (
                                        <img src={formData[field as keyof CNHData] as string} alt="Preview" className="h-24 mx-auto object-contain rounded" />
                                    ) : (
                                        <Upload className="mx-auto text-gray-400" />
                                    )}
                                    <p className="text-xs text-gray-500 font-medium uppercase">{field.replace('Image', '')}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => { setView('list'); setEditingId(null); }}
                            className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !!uploadingField}
                            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="animate-spin" size={20} />}
                            {isSubmitting ? 'Salvando...' : 'Salvar Dados'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
