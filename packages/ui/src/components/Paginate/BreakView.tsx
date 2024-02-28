interface IProp {
  breakLabel?: string;
  breakClassName?: string;
  breakHandler?: (evt: any) => void;
}
const BreakView: React.FC<IProp> = ({
  breakLabel,
  breakClassName,
  breakHandler,
}) => {
  const className = breakClassName || 'break';

  return (
    <>
      <li className={className} onClick={breakHandler}>
        <a role="button" tabIndex={0}>
          {breakLabel}
        </a>
      </li>
    </>
  );
};

export default BreakView;
