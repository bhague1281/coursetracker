angular.module('CourseServices', ['firebase', 'ui.bootstrap'])
.factory('Auth', ['$window', '$firebaseAuth', 'Users', function($window, $firebaseAuth, Users) {
  return {
    authObj: $firebaseAuth(new Firebase("https://coursetracker.firebaseio.com")),
    //cohort information
    getUserCohort: function() {
      return $window.localStorage['user-cohort'];
    },
    setCurrentCohort: function(cohort) {
      $window.localStorage['user-cohort'] = cohort;
    },
    removeCurrentCohort: function() {
      $window.localStorage.removeItem('user-cohort');
    },
    getCurrentUser: function() {
      var authData = this.authObj.$getAuth();
      return (authData && authData.github) ? authData.github : false;
    },
    //user information and functions
    getCurrentUserUid: function() {
      var authData = this.authObj.$getAuth();
      return (this.getCurrentUser()) ? authData.uid : false;
    },
    isLoggedIn: function() {
      return this.getCurrentUser() ? true : false;
    },
    login: function(callback) {
      var self = this;
      this.authObj.$authWithOAuthPopup('github').then(function(authData) {
        console.log(authData.uid);
        Users.get(authData.uid, function(user) {
          self.setCurrentCohort(user.currentCohort);
          callback(null, authData);
        });
      }).catch(function(error) {
        callback({message: 'Authentication failed', error: error}, null);
      });
    },
    logout: function() {
      this.authObj.$unauth();
      this.removeCurrentCohort();
    }
  }
}])
.factory('Cohorts', ['$firebaseObject', 'Auth', function($firebaseObject, Auth) {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/cohorts"),
    getSelected: function() {
      return $firebaseObject(this.ref.child(Auth.getUserCohort()));
    }
  }
}])
.factory('Students', ['$timeout', '$firebaseObject', function($timeout, $firebaseObject) {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/students"),
    getCohort: function(cohortName, callback) {
      this.ref.orderByChild('cohort').startAt(cohortName).endAt(cohortName).on("value", function(snapshot) {
        $timeout(function() {
          var students = [];
          snapshot.forEach(function(data) {
            students.push(data.val());
          });
          callback(null, students);
        });
      });
    },
    studentObject: function(githubUsername) {
      return $firebaseObject(this.ref.child(githubUsername));
    }
  }
}])
.factory('Users', [function() {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/users"),
    get: function(uid, callback) {
      this.ref.child(uid).once('value', function(userSnapshot) {
        callback(userSnapshot.val());
      });
    }
  }
}])
.factory('Attendance', [function() {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/attendance"),
    getAttendanceByDate: function(date, callback) {
      this.ref.orderByChild('date').startAt(date).endAt(date).on("value", function(snapshot) {
        $timeout(function() {
          var attendance = [];
          snapshot.forEach(function(student) {
            attendance.push(student.val());
          });
          callback(null, attendance);
        });
      });
    }
  }
}])
.factory('Projects', ['$firebaseObject', function($firebaseObject) {
  return {
    ref: new Firebase("https://coursetracker.firebaseio.com/projects"),
    get: function(githubUsername) {
      if (!githubUsername) return $firebaseObject(this.ref);
      return $firebaseObject(this.ref.child(githubUsername));
    },
    add: function(project) {
      console.log(project);
    }
  }
}])
.factory('Alerts', [function() {
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    add: function(type, msg) {
      alerts.push({type: type, msg: msg});
    },
    get: function() {
      return alerts;
    },
    remove: function(idx) {
      alerts.splice(idx, 1);
    }
  }
}])
