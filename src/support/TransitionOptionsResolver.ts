import { ABTransitionOptions } from '@/interfaces';
import { defaultTransitionInOptions, defaultTransitionOutOptions } from '@/defaults';

/**
 * Resolves any transition configuration input into a normalized object
 * with `transitionIn` and `transitionOut` transition options.
 */
export class TransitionOptionsResolver {
    /**
     * Resolves the transition input into a normalized { transitionIn, transitionOut } object.
     *
     * @param {string | Partial<ABTransitionOptions> | {transitionIn: Partial<ABTransitionOptions>, transitionOut: Partial<ABTransitionOptions>}} input Can be a string (name), a single transition object, or an object with `in` and `out` configs.
     *
     * @returns {{transitionIn: ABTransitionOptions, transitionOut: ABTransitionOptions}}
     */
    static resolve(
        input?:
            string |
            Partial<ABTransitionOptions> |
            {
                transitionIn: Partial<ABTransitionOptions>;
                transitionOut: Partial<ABTransitionOptions>;
            }
    ): { transitionIn: ABTransitionOptions, transitionOut: ABTransitionOptions } {
        if ( typeof input === 'string' ) {
            return this.fromString( input );
        }
        if ( 'transitionIn' in ( input || {} ) || 'transitionOut' in ( input || {} ) ) {
            return this.fromInOutObject( input as any );
        }
        return this.fromSingleObject( input as Partial<ABTransitionOptions> );
    }

    /**
     * Builds `transitionIn` and `transitionOut` transition options using the same transition name.
     *
     * @param {string} name The name of the transition to apply to both directions.
     *
     * @returns {{transitionIn: ABTransitionOptions, transitionOut: ABTransitionOptions}}
     * @private
     */
    private static fromString( name: string ):
        { transitionIn: ABTransitionOptions; transitionOut: ABTransitionOptions } {
        return {
            transitionIn: { ...defaultTransitionInOptions, name },
            transitionOut: { ...defaultTransitionOutOptions, name }
        };
    }

    /**
     * Builds `transitionIn` and `transitionOut` transition options from a shared config object.
     *
     * @param {Partial<ABTransitionOptions>} obj A transition config applied to both directions.
     *
     * @returns {{transitionIn: ABTransitionOptions, transitionOut: ABTransitionOptions}}
     * @private
     */
    private static fromSingleObject( obj?: Partial<ABTransitionOptions> ):
        { transitionIn: ABTransitionOptions; transitionOut: ABTransitionOptions } {
        return {
            transitionIn: { ...defaultTransitionInOptions, ...( obj || {} ) },
            transitionOut: { ...defaultTransitionOutOptions, ...( obj || {} ) }
        };
    }

    /**
     * Builds separate `transitionIn` and `transitionOut` transition options from a dual-config object.
     *
     * @param {{transitionIn?: Partial<ABTransitionOptions>, transitionOut?: Partial<ABTransitionOptions>}} obj An object with distinct `transitionIn` and `transitionOut` transition configs.
     *
     * @returns {{transitionIn: ABTransitionOptions, transitionOut: ABTransitionOptions}}
     * @private
     */
    private static fromInOutObject( obj?: {
        transitionIn?: Partial<ABTransitionOptions>;
        transitionOut?: Partial<ABTransitionOptions>;
    } ):
        { transitionIn: ABTransitionOptions; transitionOut: ABTransitionOptions } {
        return {
            transitionIn: { ...defaultTransitionInOptions, ...( obj?.transitionIn || {} ) },
            transitionOut: { ...defaultTransitionOutOptions, ...( obj?.transitionOut || {} ) }
        };
    }
}