declare module 'reinput' {
    import { Component } from "react";

    type ReinputProps = {
        label?: string;
        placeholderColor?: string;
        defaultValue?: string;
        value?: string;
        activeColor?: string; 	
        color?: string;
        fontFamily?: string; 	
        fontSize?: number;
        fontWeight?: string | number;
        height?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        marginTop?: number;
        maxHeight?: number;
        minHeight?: number;
        onBlur?: () => void;
        onChangeText?: (s: string) => void;
        onContentSizeChange?: (a?: any) => void;
        onFocus?: () => void;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        paddingTop?: number;
        register?: () => void;
        textAlign?: 'left' | 'center' | 'rigth'
        labelActiveScale?: number;
        labelActiveTop?: number;
        labelActiveColor?: string;
        underlineColor?: string;
        error?: string;
    }

    class Reinput<P = {}, S = {}> extends Component<ReinputProps, S> {
        constructor(props: object);
    };

    export = Reinput;

};
