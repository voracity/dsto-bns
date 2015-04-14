package dstobns;

import java.util.ArrayList;
import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
//import com.google.api.server.spi.response.NotFoundException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;

import static dstobns.OfyService.ofy;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;

import dstobns.domain.Answer;
import dstobns.domain.BNVariable;
import dstobns.domain.Profile;

import javax.inject.Named;

/**
 * Defines v1 of Elicitation Game API (elgameapi), which provides ...
 */
@Api(
    name = "elgameapi",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class ElGameAPI {

  @ApiMethod(name = "setDisplayName", path = "setDisplayName")
  public Profile setDisplayName(final User user, @Named("name") String name) throws UnauthorizedException {
	  
	  if (user == null) {
		  throw new UnauthorizedException("Authorization required");
	  }
	  
	  String userId = user.getUserId();
	  
	  // Get the Profile from the datastore if it exists, otherwise create a new one
      Profile profile = ofy().load().key(Key.create(Profile.class, userId)).now();
      if (profile == null) profile = new Profile(user); 
      
	  profile.setDisplayName(name);
	  
	  // Save the entity in the datastore
      ofy().save().entity(profile).now();
      
	  return profile;
	  
  }
  
  @ApiMethod(
		  name = "saveVariable", 
		  path = "put-variable", 
		  httpMethod = HttpMethod.POST
		  )
  // The request that invokes this method should provide data that
  // conforms to the fields defined in NewVariableForm
  public BNVariable saveVariable(final User user, 
		  @Named("uniqueId") Long uniqueId, 
		  @Named("name") String name, 
		  @Named("label") String label, 
		  @Named("states") String states
		  )
				  throws UnauthorizedException {

      // If the user is not logged in, throw an UnauthorizedException
      if (user == null) {
          throw new UnauthorizedException("Authorization required");
      }
      
      BNVariable variable = new BNVariable(uniqueId, name, label, states); 
      
      // Save the entity in the datastore
      ofy().save().entity(variable).now();

      // Return the profile
      return variable;
  }
  
  @ApiMethod(
		  name = "saveAnswer", 
		  path = "put-answer", 
		  httpMethod = HttpMethod.POST
		  )
  // The request that invokes this method should provide data that
  // conforms to the fields defined in NewVariableForm
  public Answer saveAnswer(final User user, 
		  @Named("uniqueId") Long uniqueId, 
		  @Named("comment") String comment, 
		  @Named("value") Boolean value
		  )
				  throws UnauthorizedException {

      // If the user is not logged in, throw an UnauthorizedException
      if (user == null) {
          throw new UnauthorizedException("Authorization required");
      }
      
      Answer answer = ofy().load().key(Key.create(Answer.class, uniqueId)).now(); 
      
      answer.setValue(value); 
      answer.setComment(comment); 
      
      // Save the entity in the datastore
      ofy().save().entity(answer).now(); 

      // Return the profile
      return answer;
  }
  
  @ApiMethod(name = "retrieveVariables", path = "get-variables", httpMethod = HttpMethod.GET)
  // Retrieve all variables 
  public List<BNVariable> retrieveVariables(final User user)
		  throws UnauthorizedException {

      // If the user is not logged in, throw an UnauthorizedException
      if (user == null) {
          throw new UnauthorizedException("Authorization required");
      }

      return ofy().load().type(BNVariable.class).list();
  }
  
  @ApiMethod(
		  name = "retrieveAnswers", 
		  path = "get-answers", 
		  httpMethod = HttpMethod.GET
		  )
  // The request that invokes this method should provide data that
  // conforms to the fields defined in NewVariableForm
  public List<Answer> retrieveAnswers(final User user)
				  throws UnauthorizedException {

      // If the user is not logged in, throw an UnauthorizedException
      if (user == null) {
          throw new UnauthorizedException("Authorization required");
      }
      
      List<BNVariable> variables = ofy().load().type(BNVariable.class).list(); 
      
      Answer answer; 
      List<Answer> answers = new ArrayList<Answer>(); 
      
      for(BNVariable variableCause : variables) {
    	  for(BNVariable variableEffect : variables) {
    		  
    		  answer = ofy().load().type(Answer.class)
    				  .filter("userId", user.getUserId())
    				  .filter("bnvariableCause", variableCause.getUniqueId())
    				  .filter("bnvariableEffect", variableEffect.getUniqueId())
    				  .first().now();
    		  
    		  if(answer == null) {
    			  
    			  answer = new Answer(user.getUserId(), variableCause.getUniqueId(), variableEffect.getUniqueId()); 
    			  // Save the entity in the datastore 
    		      ofy().save().entity(answer).now(); 
    		  }
    		  
    		  answers.add(answer); 
    		  
    	  }
      }
      
      return answers;
  }

  @ApiMethod(name = "getProfile", path = "getProfile")
  public Profile getProfile(final User user) throws UnauthorizedException {
    if (user == null) {
      throw new UnauthorizedException("Authorization required");
    }
    
    String userId = user.getUserId();
    Key key = Key.create(Profile.class, userId);

    // Get the Profile from the datastore if it exists, otherwise create a new one
    Profile profile = (Profile) ofy().load().key(key).now();
    if (profile == null) {
    	profile = new Profile(user); 
    	// Save the entity in the datastore
        ofy().save().entity(profile).now();
    }
    
    return profile;
    
  }

  
  
}
