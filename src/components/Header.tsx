import React from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import IconButton from './IconButton';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import Logo from './Logo';

const Header = () => {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-dark">
      <Logo size="lg" src="/vercel.svg" alt="Xulinos Logo" />
      <div className="flex items-center gap-4">
        <SecondaryButton name="Demander un service" />
        <PrimaryButton name="Créer mon couteau" />
        <IconButton icon={<FaShoppingCart />} />
        <IconButton icon={<FaUser />} />
      </div>
    </div>
  );
};

export default Header;