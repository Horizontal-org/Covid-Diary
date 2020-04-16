declare module 'react-native-button' {
    import { Component } from "react";

    type ButtonProps = {
        allowFontScaling?: boolean;
        accessibilityLabel?: string;
        containerStyle?: object;
        disabledContainerStyle?: object;
        disabled?: boolean;
        style?: object;
        styleDisabled?: object;
        childGroupStyle?: object;
        onPress: ()=>void;
        onLongPress?: () => void;
    }

    class Button<P = {}, S = {}> extends Component<ButtonProps, S> {
        constructor(props: object);
    };

    export = Button;

};
