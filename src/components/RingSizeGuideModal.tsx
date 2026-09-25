import React, { useState } from 'react';
import { X, Ruler, HelpCircle, CheckCircle } from 'lucide-react';

interface RingSizeGuideModalProps {
  onClose: () => void;
}

export const RingSizeGuideModal: React.FC<RingSizeGuideModalProps> = ({ onClose }) => {
  const [innerDiameterMm, setInnerDiameterMm] = useState<number>(16.5);

  // Indian standard ring size conversion table
  const sizeChart = [
    { indianSize: 8, diameterMm: 15.3, circumferenceMm: 48.0, usSize: '4.5' },
    { indianSize: 10, diameterMm: 15.9, circumferenceMm: 50.0, usSize: '5.25' },
    { indianSize: 12, diameterMm: 16.5, circumferenceMm: 51.9, usSize: '6.0' },
    { indianSize: 14, diameterMm: 17.2, circumferenceMm: 54.0, usSize: '6.75' },
    { indianSize: 16, diameterMm: 17.8, circumferenceMm: 56.0, usSize: '7.5' },
    { indianSize: 18, diameterMm: 18.5, circumferenceMm: 58.1, usSize: '8.25' },
    { indianSize: 20, diameterMm: 19.1, circumferenceMm: 60.0, usSize: '9.0' },
    { indianSize: 22, diameterMm: 19.7, circumferenceMm: 61.9, usSize: '9.75' },
  ];

  // find closest size
  const closest = sizeChart.reduce((prev, curr) => 
    Math.abs(curr.diameterMm - innerDiameterMm) < Math.abs(prev.diameterMm - innerDiameterMm) ? curr : prev
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FFFDFB] text-[#282329] shadow-2xl overflow-hidden border border-stone-300 my-auto"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-teal-100 flex items-center justify-between bg-[#042326] text-white">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">
              Fit & Calibration Guide
            </span>
            <h3 className="font-serif text-xl text-white">
              Indian Ring Sizing & Caliper Calibration
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-teal-200 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Interactive Ring Sizer Caliper */}
          <div className="p-4 bg-teal-50/40 border border-teal-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-stone-800 uppercase tracking-wider">
                Simulate Ring Inner Diameter
              </span>
              <span className="font-mono text-sm text-[#083338] font-bold">
                {innerDiameterMm.toFixed(1)} mm
              </span>
            </div>

            <input
              type="range"
              min="15.0"
              max="20.5"
              step="0.1"
              value={innerDiameterMm}
              onChange={(e) => setInnerDiameterMm(parseFloat(e.target.value))}
              className="w-full accent-[#083338] cursor-pointer"
            />

            {/* Visual Diameter Ring */}
            <div className="flex flex-col items-center justify-center py-4">
              <div 
                className="rounded-full border-2 border-[#083338] bg-white flex items-center justify-center transition-all duration-150 shadow-inner"
                style={{
                  width: `${innerDiameterMm * 6}px`,
                  height: `${innerDiameterMm * 6}px`,
                }}
              >
                <span className="font-mono text-[11px] font-bold text-[#083338]">
                  Size {closest.indianSize}
                </span>
              </div>
              <p className="mt-3 text-stone-600">
                Matches <strong>Indian Size {closest.indianSize}</strong> (US Size {closest.usSize} · Circumference {closest.circumferenceMm} mm)
              </p>
            </div>
          </div>

          {/* Standards Table */}
          <div className="border border-stone-200 divide-y divide-stone-200">
            <div className="grid grid-cols-4 p-2 bg-stone-100 font-semibold text-[11px] text-stone-700">
              <span>Indian Ring Size</span>
              <span>Inner Diameter (mm)</span>
              <span>Circumference (mm)</span>
              <span>US / North America</span>
            </div>
            {sizeChart.map(row => (
              <div 
                key={row.indianSize} 
                className={`grid grid-cols-4 p-2 font-mono ${row.indianSize === closest.indianSize ? 'bg-teal-50 font-bold text-[#083338]' : 'text-stone-700'}`}
              >
                <span>Size {row.indianSize}</span>
                <span>{row.diameterMm} mm</span>
                <span>{row.circumferenceMm} mm</span>
                <span>US {row.usSize}</span>
              </div>
            ))}
          </div>

          {/* Complimentary Resizing Policy */}
          <div className="p-3 bg-stone-50 border border-stone-200 text-stone-600 leading-relaxed">
            <strong className="text-[#083338] block mb-1">Elite Designer Jewelry Complimentary Sizing Guarantee:</strong>
            All solitaire and diamond engagement rings by Jigna Khakhar are eligible for one complimentary resizing within 90 days of receipt, accompanied by our master bench goldsmith certificate.
          </div>
        </div>
      </div>
    </div>
  );
};
