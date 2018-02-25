import * as React from 'react';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

export interface LoadingProps {
}

export default function Loading(props: LoadingProps) {
  return (
    <Dimmer active inverted>
      <Loader inverted></Loader>
    </Dimmer>
  );
}
