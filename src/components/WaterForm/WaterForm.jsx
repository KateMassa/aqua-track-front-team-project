import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { icons as sprite } from '../../assets/icons/index.js';
import { addWater, changeWater } from '../../redux/water/operations';
import { selectActiveDay } from '../../redux/selectors';
import css from './WaterForm.module.css';

const schema = Yup.object().shape({
  waterValue: Yup.number()
    .positive('The number must be a positive value')
    .required('Value is required'),
  localTime: Yup.string()
    // .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (hh:mm)")
    .required('Time is required'),
});

const getTimeFormat = () => {
  const date = new Date();
  const hours = date.getHours();
  const min = date.getMinutes();

  const timeFormatting = hours.toString().padStart(2, '0') + ':' + min.toString().padStart(2, '0');

  return timeFormatting;
};

export const WaterForm = ({ mode, onClose, water = {} }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      waterValue: Number(water.waterValue) || 50,
      localTime: water.localTime || getTimeFormat(),
    },
  });

  const activeDay = useSelector(selectActiveDay);
  const dispatch = useDispatch();

  const handleClickMinus = () => {
    const current = getValues('waterValue');
    setValue('waterValue', current - 50);
  };

  const handleClickPlus = () => {
    const current = getValues('waterValue');
    setValue('waterValue', current + 50);
  };

  const onSubmit = () => {
    const newData = {
      localDate: activeDay,
      waterValue: watch('waterValue'),
      localTime: watch('localTime'),
    };

    // я додав
    console.log(newData);
    //

    try {
      if (mode === 'add') {
        dispatch(addWater(newData));
        toast.success(`The amount of water consumed has been added successfully.`);
      } else if (mode === 'edit') {
        dispatch(changeWater({ _id: water._id, ...newData }));
        toast.success('The amount of water consumed has been successfully updated.');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save water data. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className={css.amountTitle}>Amount of water:</p>
      <div className={css.amountWrap}>
        <button
          type="button"
          className={css.quantityBtn}
          onClick={handleClickMinus}
          disabled={getValues('waterValue') === 0}
        >
          {/* <svg>
            <use xlinkHref={`${sprite}#icon-plus-24x24`}></use>
          </svg> */}
          <svg className={css.quantityIcon}>
            <use xlinkHref={`${sprite}#icon-minus-40x40`}></use>
          </svg>
        </button>
        <span className={css.amountValue}>
          {watch('waterValue') >= 999
            ? `${(Math.round((watch('waterValue') / 1000) * 100) / 100).toFixed(2)} L`
            : `${watch('waterValue')} ml`}
        </span>
        <button type="button" className={css.quantityBtn} onClick={handleClickPlus}>
          {/* <svg >
          <use xlinkHref={`${sprite}#icon-minus-40x40`}></use>
        </svg> */}
          <svg className={css.quantityIcon}>
            <use xlinkHref={`${sprite}#icon-plus-40x40`}></use>
          </svg>
        </button>
      </div>

      <div>
        <div className={css.valueDiv}>
          <label className={css.labelTime} htmlFor="localTime">
            Recording time:
          </label>
          <input
            {...register('localTime')}
            className={css.input}
            type="time"
            name="localTime"
            id="localTime"
          />
          {errors.localTime && <span className={css.error}>{errors.localTime.message}</span>}
        </div>

        <div className={css.valueDiv}>
          <label className={css.labelVal} htmlFor="value">
            Enter the value of the water used:
          </label>
          <input
            {...register('waterValue')}
            className={css.input}
            step={50}
            name="value"
            id="value"
            onChange={e =>
              setValue(
                'waterValue',
                isNaN(e.target.value) ? 0 : Math.max(Number(e.target.value), 0)
              )
            }
          />

          {errors.waterValue && <span className={css.error}>{errors.waterValue.message}</span>}
        </div>
      </div>
      <button className={css.btnSubmit} type="submit">
        Save
      </button>
    </form>
  );
};
