

/**@type {boolean} Toggle to determine whether Custom Logs show or not. True for on, False to turn them off*/
const ENABLE_LOGS = true;

/**@type {Object} A collection of emoji icons to be used in C-LOG output */
export const icons = {
    type: "🔣",
    play: "▶️",
    tick: "✅",
    redX: "❌",
    value: "#️⃣",
    caution: "⚠️",
    warn: "⛔",
    wait: "⌛",
    set: "⚙️",
    search: "🔍",
    light: "💡",
    stop: "🛑",
    message: "💬",
    question: "❔"
};

/** 
 * @typedef {{
*            foo:string,
*            bar:number,
*            foobar: (number|string)
*          }} testType
*/

/**
 * Logs when a process or function is invoked and creates a console group. Combine with function "end()" to close the group. Additionally, will log the values of any parameter inputs if provided.
 * @param {string} context A description of the process or function being invoked
 * @param {Object<string,Object>} variables 
 * @returns {string} Returns the string to be used in a variable to be passed to other C-LOG functions in the same scope
 */
export function start(context = "Global", variables) {
    if (ENABLE_LOGS) {
        console.group("%c[%s] Starting %s",
            "color: white; background-color: #004d18; padding: 2px", icons.play, context);
        if (variables) { ValueOf(variables, `Start.${context}`); }
    }
    return context;
}

export function end(context = "Global", message) {
    if (ENABLE_LOGS) {
        console.debug(`${icons.message}[${context}]: ${message}`);
        console.groupEnd();
    }
}
/**@typedef { 'Input'|'Validation'} customError */


/**
 * Custom error message log - uses console.warn and does not throw any errors (...yet)
 * @param {customError} errType
 * @param {any} message Description of the error
 * @param {string} context Context the function was called from, eg the Function Name 
 * @param {?string} [fixMessage] Optional instructions to resolve the error
 * @param {?bool} [doAlert]
 * 
 */
export function Err(errType = "generic", message = "There was a generic, undefined error.", context = "Global", fixMessage, doAlert = false) {
    fixMessage ? console.groupCollapsed("%c%s%sError: %s", "color: white; background-color: #660000; padding: 2px", icons.warn, errType, context) : "";

    console.warn(`${icons.warn}[${context}] ${errType}Error: ${message}`);

    fixMessage ? (console.info(`${icons.light}Solution: ${fixMessage}`), console.groupEnd()) : "";

    doAlert?alert(`${icons.warn}[${context}] ${errType}Error: ${message}`):"";
}

/**
 * 
 * Logs the value of given variables to the console with the context
 * @param { ...Object } variables An object containing description-variable(object) pairs
 * @param { string } variables.label- Text to describe the variable being logged.
 * @param { string } variables.variable - The variable object to log.
 * @param { string } context Where the request is called from, for context. Most likely to use function name
  * @example valueOf("coolFunction", {"Variable1": var}) will log to console: [coolFunction] #️⃣VAL: Variable1 = some Value
 * 
 */
export function ValueOf({ ...variables } = "?", context = "Global") {
    if (ENABLE_LOGS) {
        if (Object.is(variables,null), Object.keys(variables)[0] === "0" || typeof variables !== 'object') {
            Err("Input", "Invalid or missing variable when invoking: ", `ValueOf(variables)`,
                'Ensure variables are passed in an object as {"label":variable} pairs');
            return;

        } else {
            Object.keys(variables).length > 1 ? console.group(`${icons.value}[${context}]: Values Of:`) : "";
            
            for (const [label, variable] of Object.entries(variables)) {
                console.debug(`${icons.value}[${context}] ${label} =`, variable);
            }
    
            Object.keys(variables).length > 1 ? console.groupEnd() : "";
        }
    }
};

/**
 * Constructs a basic custom message, and either returns it as a string, or logs to console
 * @param {string} message 
 * @param {Object} iconTag 
 * @param {string} context 
 * @param {boolean} [doReturn]
 * @return {string}
 * 
 */
export function custom(message, iconTag = icons.message, context = "Global", doReturn = false) {
    let fullMessage = `${iconTag}[${context}]: ${message}`;
    if (!doReturn) {
        console.debug(fullMessage);
    } else {
        return fullMessage;
    }
}
