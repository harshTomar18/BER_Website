import { createContext, useContext, useState } from 'react';
const ConsultContext = createContext({ open: false, openModal: () => {}, closeModal: () => {} });
export const useConsult = () => useContext(ConsultContext);
export function ConsultProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <ConsultContext.Provider value={{ open, openModal: () => setOpen(true), closeModal: () => setOpen(false) }}>
      {children}
    </ConsultContext.Provider>
  );
}
