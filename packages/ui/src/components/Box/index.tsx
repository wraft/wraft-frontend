import { CreateWuiProps, forwardRef } from "@/system";

import * as S from "./styles";

export type BoxProps = Omit<CreateWuiProps<"div">, "dataTestId"> & {
  variant?: string;
};

export const Box = forwardRef<"div", BoxProps>(({ ...rest }, ref) => {
  return <S.Box ref={ref} {...rest} />;
});
