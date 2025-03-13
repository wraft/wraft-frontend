import * as S from "./styles";

import { CreateWuiProps, forwardRef } from "@/system";

export type BoxProps = Omit<CreateWuiProps<"div">, "dataTestId"> & {
  variant?: string;
};

export const Box = forwardRef<"div", BoxProps>(({ ...rest }, ref) => {
  return <S.Box ref={ref} {...rest} />;
});
