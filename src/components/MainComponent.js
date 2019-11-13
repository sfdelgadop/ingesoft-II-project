import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import DishDetail from './DishdetailComponent';
import Options from './OptionsComponent';
import Create from './DishCreationComponent';
import { postComment, postUser, postLogin, fetchDishes, fetchComments, fetchPromos, fetchIngredients } from '../redux/ActionCreators';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

//map the diferent data into propeties
const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders,
    ingredients: state.ingredients
  }
}

//map the diferent data from post anfetch into propeties
const mapDispatchToProps = dispatch => ({

  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  postUser:(firstName, lastName, username, email, password, age, gender) => dispatch(postUser(firstName, lastName, username, email, password, age, gender)),
  postLogin: (username,pasword) => dispatch(postLogin(username,pasword)),
  fetchDishes: () => { dispatch(fetchDishes())},
  fetchIngredients: () => { dispatch(fetchIngredients())},
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos())
});

//main componnent
class Main extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchIngredients();
  }

  onDishSelect(dishId) {
    this.setState({ selectedDish: dishId });
  }

  render() {
    //pass the props of a dish to the dishDetailComponent
    const DishWithId = ({ match }) => {
      return (
        <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
          commentsErrMess={this.props.comments.errMess}
          postComment={this.props.postComment}
        />
      );
    };

    return (
      <div>
        <div className="row">
          <div className="col-8">
            <Switch>
              <Route exact path='/home' component={() => <Menu dishes={this.props.dishes} />} />
              <Route path='/script/:dishId' component={DishWithId} />
              <Route exact path='/contactus' component={Contact} />
              <Route exact path='/create' component={() => <Create ingredients={this.props.ingredients}/>}/>
              <Redirect to="/home" />
            </Switch>
          </div>
          <div className="col-4">
            <Header />
            <Options postLogin = {this.props.postLogin} 
                    postUser={this.props.postUser}/>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Footer />
          </div>
        </div>

      </div>

    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));