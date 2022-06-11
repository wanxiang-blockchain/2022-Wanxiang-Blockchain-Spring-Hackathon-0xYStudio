import { Component, FC } from "react";
/**
 * Load react components asynchronously
 * @method asyncComponent
 * @param {FC} importComponent
 * @returns  {FC}
 */
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      /* eslint-disable */
      const C = this.state.component;
      /* eslint-disable */
      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
