package dstobns;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
//import com.google.api.server.spi.response.NotFoundException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;

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
	  
	  Profile profile = new Profile(user);
	  profile.setDisplayName(name);
	  return profile;
	  
  }
  
  @ApiMethod(name = "storeVariable", path = "storeVariable", httpMethod = "post")
  public BNVariable storeVariable(final User user, BNVariable variable) throws UnauthorizedException {
	  
	  if (user == null) {
	      throw new UnauthorizedException("Authorization required");
	    }
	  
	  return variable;
	  
  }

  @ApiMethod(name = "getProfile", path = "getProfile")
  public Profile getProfile(final User user) throws UnauthorizedException {
    if (user == null) {
      throw new UnauthorizedException("Authorization required");
    }
    
    return new Profile(user);
  }

  
  
}
