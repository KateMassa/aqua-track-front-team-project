import { icons as sprite } from '../../assets/icons/index.js';
import { WaterForm } from '../WaterForm/WaterForm';

import css from './WaterModal.module.css';

const WaterModal = ({ isOpen, mode, onClose, water }) => {
  const title =
    mode === 'add' ? (
      <h2 className={css.title}>Add Water</h2>
    ) : (
      <h2 className={css.title}>Edit the entered amount of water</h2>
    );

  const subtitle =
    mode === 'add' ? (
      <p className={css.subtitle}>Choose a value:</p>
    ) : (
      <p className={css.subtitle}>Correct entered data:</p>
    );

  return (
    <div className={css.wrapModal}>
      <button type="button" className={css.closeBtn} onClick={onClose}>
        <svg className={css.closeIcon}>
          <use xlinkHref={`${sprite}#icon-close-24x24`}></use>
        </svg>
      </button>
      {title}
      {subtitle}
      <WaterForm mode={mode} onClose={onClose} water={water} />
    </div>
  );
};

export default WaterModal;
