import { createStyles, keyframes } from 'antd-style';

const logoPulse = keyframes`
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.06);
    opacity: 0.9;
  }
`;

const glowPulse = keyframes`
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.88);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.12);
  }
`;

const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
  `,
  logoWrap: css`
    position: relative;
    display: inline-flex;
  `,
  glow: css`
    position: absolute;
    inset: 0;
    margin: auto;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(22, 119, 255, 0.18) 0%,
      rgba(22, 119, 255, 0) 70%
    );
    animation: ${glowPulse} 1.6s ease-in-out infinite;
    pointer-events: none;
  `,
  logo: css`
    position: relative;
    width: 120px;
    height: auto;
    animation: ${logoPulse} 1.6s ease-in-out infinite;
  `,
}));

const LogoLoading: React.FC = () => {
  const { styles } = useStyles();
  return (
    <div className={styles.container}>
      <div className={styles.logoWrap}>
        <span className={styles.glow} aria-hidden />
        <img className={styles.logo} src="/logo.svg" alt="logo" />
      </div>
    </div>
  );
};

export default LogoLoading;
