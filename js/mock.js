
var helper = require("./helper.js")
var data = require('../mock_data/mock.json'); 

describe('getPossibleAssignees', function() {
    it('should increment stored value by one', function() {
      var storeMock = sinon.mock(helper);
      storeMock.expects('getPossibleAssignees').withArgs('issueNumber').returns(data.users);
      //storeMock.expects('set').once().withArgs('data', 1);
  
      getPossibleAssignees(1);
  
      storeMock.restore();
      storeMock.verify();
    });
  });

  mocha.run();