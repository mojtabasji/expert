import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


type colors = {
    primary: string,
    secondary: string,
    third: string,
    fourth: string,
    fifth: string,

    white: string,
    middle: string,
    black: string,
    dark: string,
    gray: string,
    linkBlue: string,
    blue: string,
    light: string,
    red: string,
};


class css {
    static redesign: {
        darker: string,
        primary: string,
        secondary: string,
        lightest: string,

        supplement: string,
        supplement2: string,

        gray: string,
        black: string,
    } = {
        darker: '#27353B',
        primary: '#D8E6E1',
        secondary: '#FCF7EC',
        lightest: '#F9F9F9',
        
        supplement: '#F68F5F',
        supplement2: '#FF4B4D',

        gray: '#A9A7A0',
        black: '#252525',
    };

    static get colors(): colors {
        return {
            // primary: '#0C6980',
            // secondary: '#00A8A8',
            // third: '#2EB5E0',
            // fourth: '#C4DBE0',
            // fifth: '#F4F6F9',

            primary: '#121F2D',
            secondary: '#263546',
            third: '#718C93',
            fourth: '#D9D7D2',
            fifth: '#68DBCC',

            white: '#fff',
            middle: '#DDE5E7',
            black: '#0B141D',
            dark: '#4b4b4b',
            gray: '#7A828B',
            light: '#F4F6F9',


            linkBlue: '#00A6FF',
            blue: '#027CFF',
            red: '#FF0000',
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

    static get titleText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(18),
            color: '#000',
            fontWeight: '600',
        };
    }

    static get normalText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(16),
            color: '#000',
            fontWeight: '600',
        };
    }

    static get smallText(): object {
        return {
            fontFamily: 'IRANSansMobile',
            fontSize: RFValue(14),
            color: '#000',
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
