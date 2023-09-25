import { Text } from 'theme-ui';
interface props {
  text: any;
}
function Error({ text }: props) {
  return <Text sx={{ color: 'red.5' }}>{text}</Text>;
}
export default Error;
