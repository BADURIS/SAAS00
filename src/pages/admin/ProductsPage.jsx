import React, { useState } from 'react';
import { Edit2, Trash2, Plus, X, Save, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: 0,
        minStock: 5
    });

    const categories = ['Assados', 'Acompanhamentos', 'Bebidas', 'Marmita'];

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ ...product });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Assados',
                image: '',
                stock: 0,
                minStock: 5
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            minStock: parseInt(formData.minStock)
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, dataToSave);
        } else {
            addProduct(dataToSave);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            deleteProduct(id);
        }
    };

    const inputClasses = "w-full p-2.5 bg-background border border-surface-light rounded-lg text-white focus:outline-none focus:border-brand/50 transition-colors";
    const labelClasses = "block mb-2 text-xs font-bold tracking-widest uppercase text-text-secondary";

    return (
        <div className="text-text-primary">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Produtos e Estoque</h1>
                <Button variant="primary" onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus size={20} />
                    Novo Produto
                </Button>
            </div>

            <div className="flex flex-col gap-12">
                {categories.map(category => {
                    const categoryProducts = products.filter(p => p.category === category);

                    return (
                        <div key={category}>
                            <h2 className="text-2xl font-serif font-bold text-white mb-6 border-b border-surface-light pb-2">
                                {category}
                            </h2>

                            {categoryProducts.length === 0 ? (
                                <p className="text-text-muted italic bg-surface p-6 rounded-lg border border-surface-light text-center">Nenhum produto nesta categoria.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {categoryProducts.map((product) => (
                                        <div key={product.id} className="bg-surface rounded-xl border border-surface-light overflow-hidden transition-all hover:border-brand/30 hover:shadow-[0_0_15px_rgba(230,138,92,0.05)] group flex flex-col">
                                            <div className="h-48 relative bg-background flex items-center justify-center border-b border-surface-light overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <ImageIcon size={48} className="text-surface-light" />
                                                )}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="font-serif font-bold text-lg text-white mb-2 leading-tight">{product.name}</h3>
                                                <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>

                                                <div className="flex justify-between items-end mt-4 pt-4 border-t border-surface-light/50">
                                                    <span className="font-bold text-brand text-xl">R$ {product.price.toFixed(2)}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(product)}
                                                            className="p-2 bg-surface-light rounded-lg text-text-muted hover:text-white hover:bg-[#333] transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 bg-danger/10 rounded-lg text-danger border border-transparent hover:border-danger/30 hover:bg-danger/20 transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-surface-light shadow-2xl custom-scrollbar">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-surface-light">
                            <h2 className="text-2xl font-serif text-white font-bold tracking-wide">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-text-muted hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label className={labelClasses}>Nome</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={inputClasses}
                                    placeholder="Ex: Costela Bovina Assada"
                                />
                            </div>

                            <div>
                                <label className={labelClasses}>Descrição</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className={inputClasses}
                                    placeholder="Detalhes do produto, acompanhamentos, porção..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Preço (R$)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">R$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="price"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            className={`${inputClasses} pl-10`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Categoria</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className={inputClasses}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 border border-surface-light rounded-lg bg-background/50">
                                <label className={labelClasses}>Foto do Produto</label>
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 shrink-0 bg-background border border-surface-light rounded-lg flex items-center justify-center overflow-hidden">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={24} className="text-surface-light" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setFormData({ ...formData, image: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-surface-light file:text-white hover:file:bg-[#333] cursor-pointer"
                                        />
                                        <p className="text-xs text-text-muted mt-2">Dica: Use imagens quadradas e bem iluminadas para destacar o produto.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-surface-light rounded-lg bg-background/50">
                                <div>
                                    <label className={labelClasses}>Estoque Inicial</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Estoque Mínimo (Alerta)</label>
                                    <input
                                        type="number"
                                        name="minStock"
                                        value={formData.minStock}
                                        onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button variant="primary" type="submit" className="flex items-center gap-2">
                                    <Save size={20} />
                                    {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
