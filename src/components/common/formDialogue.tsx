import React from "react";
interface dialogProps {
  title: string;
  children: React.ReactNode;
}

const FormDialogue: React.FC<dialogProps> = ({ title, children }) => {
  return (
    <>
      <div id="overlay"></div>

      <dialog id="custom-dialog" open>
        <p className="dialog-title">{title}</p>

        {children}
      </dialog>
    </>
  );
};

export default FormDialogue;
