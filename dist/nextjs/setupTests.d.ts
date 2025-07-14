import 'jest-environment-jsdom';
import '@testing-library/jest-dom';
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveTextContent(text: string): R;
            toHaveStyle(style: string | object): R;
        }
    }
}
//# sourceMappingURL=setupTests.d.ts.map