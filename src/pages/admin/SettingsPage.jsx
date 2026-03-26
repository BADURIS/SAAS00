import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    const { settings, updateSettings } = useStore();
    const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
        defaultValues: settings
    });

    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const onSubmit = (data) => {
        updateSettings(data);
        alert('Configurações salvas com sucesso!');
    };

    const inputClasses = "w-full p-3 bg-background border border-surface-light rounded-lg text-text-primary focus:outline-none focus:border-brand/50 transition-colors";
    const labelClasses = "block mb-2 text-sm font-bold tracking-widest uppercase text-text-secondary";
    const sectionClasses = "bg-surface p-8 rounded-xl border border-surface-light";
    const sectionTitleClasses = "font-serif text-xl border-b border-surface-light pb-4 mb-6 text-white";

    return (
        <div className="max-w-4xl text-text-primary">
            <div className="flex items-center gap-4 mb-10">
                <SettingsIcon size={32} className="text-brand" />
                <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Configurações do Site</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* General Info */}
                <div className={sectionClasses}>
                    <h2 className={sectionTitleClasses}>Informações Gerais</h2>

                    <div>
                        <label className={labelClasses}>Descrição do Rodapé</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className={sectionClasses}>
                    <h2 className={sectionTitleClasses}>Contato</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={labelClasses}>Telefone / WhatsApp</label>
                            <input
                                {...register('contact.phone')}
                                type="text"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Instagram</label>
                            <input
                                {...register('contact.instagram')}
                                type="text"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses}>Endereço Completo</label>
                        <textarea
                            {...register('contact.address')}
                            rows={2}
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Hours */}
                <div className={sectionClasses}>
                    <h2 className={sectionTitleClasses}>Horários de Funcionamento</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Segunda a Sexta (Seg - Sex)</label>
                            <input
                                {...register('hours.weekdays')}
                                type="text"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Sábado e Domingo (Sáb - Dom)</label>
                            <input
                                {...register('hours.weekend')}
                                type="text"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-start">
                    <Button variant="primary" type="submit" disabled={!isDirty} className="flex items-center gap-2">
                        <Save size={20} />
                        Salvar Alterações
                    </Button>
                </div>

            </form>
        </div>
    );
}
