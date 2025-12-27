declare module 'react-quill' {
  import { Component } from 'react';
  
  interface ReactQuillProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    theme?: string;
    modules?: any;
    formats?: string[];
    readOnly?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export default class ReactQuill extends Component<ReactQuillProps> {}
}