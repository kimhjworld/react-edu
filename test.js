var createStore = require('redux').createStore; //babel 이 아닌 commonjs로..


/*
    action이 오면 저장되 있는 값을 반환하는 Reducer라는 걸 생성함
    전달은 action을 함수로 전달한다.
    액션과 state의 연결 고리를 지정해 놓았다고 생각한다.

    1. 리듀서(액션을 포함)
    2. 스토어 ( 리듀서로 만든다 )
    3. 쓸때는 dispatch
    4. dispatch 할때마다 subscribe 저장소의 값을 출력한다
*/
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

/* 저장소를 만들땐  createStore 안에 reducer를 지정해준다 */
let store = createStore(counter)

// subscribe 로 상태 값의 변동이 있으면 console에 뿌려준다.
//dispatch : 화면의 변화가 일어날때마다 갱신...
store.subscribe(() =>
  console.log(store.getState())
)

//액션은 dispatch로 실행하고 액션을 넘겨준다.
//dispatch 를 할때마다 저장소에 값을 변경한다.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1





/*
#기본개념 Redux의 기본개념은, 앱에서 사용하는 모든 ‘state’를 하나의
tree로 관리하겠다는 것이다.
React에서는, 각 컴포넌트마다 state값을 가질 수 있다.
이 값들이 분산되어있고 관리가 되지 않는다면,
어플리케이션 규모에 따라 관리하기가 어려워질 것이다.

#Store Store란, 앞서말한 State Tree가 저장되는 곳을 말한다.
Redux는 Tree가 하나라고 있으니, Store도 당연히 하나라고 가정한다.

*/
