import { PageInfo } from "./PageInfo.model";

export interface CustomPage<T> {
    items : T[];
    pageInfo : PageInfo;
}