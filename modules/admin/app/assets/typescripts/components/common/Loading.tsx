import * as React from 'react';

export interface LoadingProps {
}

export default function Loading (props: LoadingProps) {
    return(<div className="loading"><img src="/assets/images/rolling.svg" alt="" /> </div>);
}
