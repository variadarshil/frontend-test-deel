1. What is the difference between Component and PureComponent? Give
an example where it might break my app.
Ans: When component is updated, it re-renders whenever parent component re-renders regardless of props or state change. Whereas pure component only re-renders when props or state gets changed.
If we are using non primitive data structure like array and arrays are reference type and does shallow comparison. Pure component will only check if the reference to the array has changed, not its contents. If you pass a new array with the same elements, the PureComponent will not re-render, leading to potential bugs.

2. Context + ShouldComponentUpdate might be dangerous. Why is that?
Ans: Context might not trigger re-render. If context value is a nested object or complex data structure and only part of it is updated, the component then won’t re-render automatically.
ShouldComponentUpdate solely relies on shallow comparisons of props and state to determine whether to re-render or not. The combination of both can make code hard to maintain, as we need to ensure that all custom update checks correctly handle all relevant data dependencies.

3. Describe 3 ways to pass information from a component to its PARENT.
Ans: 1. Callback function : The child receives a function as a prop from its parent. When specific event occurs in child component, it calls this function and passes necessary argument.
2. Function reference:  Similar to callback functions, a function reference can be passed as prop to child component. The child can call this function to pass information to parent
3. Context API: using useContext in child component, we can get function passed from parent and call it when needed.

4. Give 2 ways to prevent components from re-rendering.
Ans: By doing memoization using useMemo and useCallback we can prevent unnecessary renders by memoizing/ caching values and functions. Another way is by replacing useState with userRef which persist values between renders and does not trigger re-render.

5. What is a fragment and why do we need it? Give an example where it might
break my app.
Ans: Fragment is useful when we want to return multiple elements from component, but we don’t want wrapper that adds extra node. For example 

const MyComponent = () => {
  return (
    <div>
      <p>Paragraph 1</p>
      <p>Paragraph 2</p>
    </div>
  );
};
Here we don’t need extra div node in DOM. By replacing it with <></>, we could remove extra Dom element.
Only reason I can think of fragment not working is inside specific structure like <table>. We have to use <tr> tag inside <table>. Using fragments can lead to bugs.

6. Give 3 examples of the HOC pattern.
1. Authentication HOC: 

const withAuthentication = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const isAuthenticated = /* Check user authentication status */;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

// Usage
const ProtectedComponent = withAuthentication(MyComponent);

2. Data fetching from an API:
import React, { useState, useEffect } from 'react';

const withDataFetching = (WrappedComponent) => {
  const DataFetchingComponent = (props) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
          const response = await fetch(apiUrl);
          const result = await response.json();
          setData(result);
      };

      fetchData();
    }, []);

    return <WrappedComponent data={data} loading={loading} {...props} />;
  };

  return DataFetchingComponent;
};

// Usage
const ComponentWithDataFetching = withDataFetching(MyComponent);

3. Connect function: Connect function connects component to redux store
E.g export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)


7. What's the difference in handling exceptions in promises, callbacks
and async...await?
Ans: promises uses .then() and .catch() methods to handle resolve values and errors, respectively.
In callbacks, first parameter is reserved for error object. If error occurs it will be passed as a first argument.
myFunction((error, res) => {
	if (error) //exception
	else res
})
With async await, we can use try catch block where try contains async operations and catch handles exception.

8. How many arguments does setState take and why is it async.
Ans: setState takes two arguments. First argument can be an object or callback function and second argument is function that runs after setState runs. We usually pass only first argument to make use of async nature of setState.
Reason for async operations: React batches multiple setState updates to improve performance and it also provides consistency because state is updating in controlled manner.

9. List the steps needed to migrate a Class to Function Component.
Ans: 1. Remove extends React.component
2. Convert class methods to functions
3. Replace most common life cycles(i.e componentDidMount and ComponentDidUpdate)  with useeffect hook.
4. Replace this.state with useState hook for local state management.
5. Replace this.props with function parameters.
6. Remove this keyword while referencing state, props and functions.

10. List a few ways styles can be used with components.
Ans:  1. Inline styles : use style attribute directly on JSX element
2. CSS Classes: Apply classes using className attribute.
import './MyComponent.css';
<div className="my-component">Styled Component</div>
3. CSS Modules: CSS modules provides a way to use styles locally. It is scoped for particular component. And styles are listed in css file.
import styles from './MyComponent.module.css';
<div className={styles.myComponent}>Styled Component</div>
4. Styles components: Styles components allow you to directly write styles in JSX component file.
import styled from 'styled-components';

const StyledComponent = styled.div`
  color: blue;
  font-size: 16px;
`;
const MyComponent = () => {
  return <StyledComponent>Styled Component</StyledComponent>;
};

11. How to render an HTML string coming from the server.
Ans: we can use dangerouslySetInnerHTML. We have to make sure content receiver from server is sanitized.
<div dangerouslySetInnerHTML={{ __html: htmlStringFromServer }} />;



