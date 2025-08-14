import { lookupToSelect } from './modules/plugin';
import { DVEntity } from './modules/power-pages/types';
import { 
    LookupToSelectOptions, 
    EntityConfig, 
} from './modules/types';

declare global {
    interface JQuery {
        lookupToSelect<T extends DVEntity = DVEntity>(options?: LookupToSelectOptions<T>): Promise<JQuery>;
    }
}

jQuery.fn.lookupToSelect = lookupToSelect;

export default jQuery.fn.lookupToSelect;
export { LookupToSelectOptions, EntityConfig, GetDataFunction };
