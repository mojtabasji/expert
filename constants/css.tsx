import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


type colors = {
    primary: string,
    secondary: string,
    success: string,
    danger: string,
    warning: string,
    info: string,
    light: string,
    light_dark: string,
    linkBlue: string,
    dark: string,
    white: string,
    black: string,
    gray: string,
    blue: string,
    indigo: string,
    purple: string,
    pink: string,
    red: string,
    orange: string,
    yellow: string,
    green: string,
    teal: string,
    cyan: string,
};


class css {

    static get colors(): colors {
        return {
            primary: 'lightblue',
            secondary: '#cdddf2',
            success: '#000',
            danger: '#000',
            warning: '#000',
            info: '#000',
            light: '#000',
            light_dark: '#aeaeae',
            linkBlue: '#00A6FF',
            dark: '#4b4b4b',
            white: '#000',
            black: '#202020',
            gray: '#e8e8e8',
            blue: '#006CFF',
            indigo: '#000',
            purple: '#000',
            pink: '#000',
            red: '#d63031',
            orange: '#000',
            yellow: '#000',
            green: '#000',
            teal: '#000',
            cyan: '#1abc9c',
        };
    }

    static get btn_text(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(14),
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
        };
    }

    static get largeText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(25),
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
        };
    }

    static get normalText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(16),
            color: '#000',
            textAlign: 'center',
            fontWeight: '600',
        };
    }

    static get smallText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(14),
            color: '#000',
            textAlign: 'center',
            fontWeight: '500',
        };
    }

    static get minimalText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(10),
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
        }
    }

    static get minText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(8),
            color: '#000',
            textAlign: 'center',
            fontWeight: 'bold',
        }
    }

}


export default css;
