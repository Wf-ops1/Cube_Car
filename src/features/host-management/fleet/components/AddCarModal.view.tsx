import React from 'react';
import { useAddCarLogic } from './AddCarModal.logic';

interface AddCarModalProps {
  onClose: () => void;
  onCarAdded: () => void;
}

const AddCarModal: React.FC<AddCarModalProps> = ({ onClose, onCarAdded }) => {
  const {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    handleChange,
    handleSubmit
  } = useAddCarLogic(onClose, onCarAdded);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-fade-in-up text-center border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <i className="fas fa-check text-4xl text-green-600"></i>
          </div>
          <h2 className="text-3xl font-display font-medium text-[#181824] mb-4">Carro Enviado!</h2>
          <p className="text-[#484848] mb-10 leading-relaxed text-lg">
            Sua solicitação foi enviada para nossa equipe. Em breve você receberá um retorno sobre a aprovação.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#3667AA] text-white font-bold py-4 rounded-2xl hover:bg-[#2c528a] transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
          >
            Entendi, obrigado!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-fade-in-up overflow-hidden border border-gray-100 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#3667AA]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-display font-medium text-[#181824]">Cadastre Seu Veículo</h2>
            <p className="text-sm text-[#484848] mt-1">Siga os passos para alugar seu carro.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Marca</label>
              <input
                required
                className={`w-full bg-gray-50 border rounded-2xl px-4 py-3.5 outline-none transition-all ${errors.make ? 'border-red-200 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400'}`}
                value={formData.make}
                onChange={e => handleChange('make', e.target.value)}
                placeholder="Ex: Tesla"
              />
              {errors.make && <p className="text-[10px] text-red-500 mt-2 uppercase font-bold tracking-tight">{errors.make}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Modelo</label>
              <input
                required
                className={`w-full bg-gray-50 border rounded-2xl px-4 py-3.5 outline-none transition-all ${errors.model ? 'border-red-200 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400'}`}
                value={formData.model}
                onChange={e => handleChange('model', e.target.value)}
                placeholder="Ex: Model 3"
              />
              {errors.model && <p className="text-[10px] text-red-500 mt-2 uppercase font-bold tracking-tight">{errors.model}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ano</label>
              <input
                type="number"
                required
                className={`w-full bg-gray-50 border rounded-2xl px-4 py-3.5 outline-none transition-all ${errors.year ? 'border-red-200 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400'}`}
                value={formData.year}
                onChange={e => handleChange('year', parseInt(e.target.value))}
              />
              {errors.year && <p className="text-[10px] text-red-500 mt-2 uppercase font-bold tracking-tight">{errors.year}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Categoria</label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 outline-none appearance-none cursor-pointer"
                value={formData.type}
                onChange={e => handleChange('type', e.target.value)}
              >
                <option value="Sedan">Sedan</option>
                <option value="Hatch">Hatch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Localização</label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                required
                className={`w-full bg-gray-50 border rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all ${errors.location ? 'border-red-200 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400'}`}
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                placeholder="Cidade ou região"
              />
            </div>
            {errors.location && <p className="text-[10px] text-red-500 mt-2 uppercase font-bold tracking-tight">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Preço por Dia</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
              <input
                type="number"
                required
                min="1"
                className={`w-full bg-gray-50 border rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all ${errors.pricePerDay ? 'border-red-200 focus:ring-2 focus:ring-red-100' : 'border-gray-100 focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400'}`}
                value={formData.pricePerDay}
                onChange={e => handleChange('pricePerDay', parseInt(e.target.value))}
              />
            </div>
            {errors.pricePerDay && <p className="text-[10px] text-red-500 mt-2 uppercase font-bold tracking-tight">{errors.pricePerDay}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#181824] text-white font-bold py-4 rounded-2xl hover:opacity-95 transition-all mt-4 disabled:bg-gray-200 disabled:text-gray-400 flex justify-center items-center shadow-lg active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg className="loader-container h-5 w-5" viewBox="25 25 50 50" style={{ width: '1.25em', height: '1.25em' }}>
                  <circle className="loader-svg loader-white" cx="50" cy="50" r="20"></circle>
                </svg>
                <span>Listing Car...</span>
              </div>
            ) : 'List Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;