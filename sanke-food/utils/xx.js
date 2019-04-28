var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,//得分
    maxscore: 0,//最高得分
    startx: 0,//开始的x位置
    starty: 0,//开始的y位置
    endx: 0,//结束的x位置
    endy: 0,//结束的y位置
    ground: [],//储存操场每个方块
    rows: 28,//操场的长度
    cols: 22,//操场的宽度
    snake: [],//存蛇
    food: [],//存食物
    direction: '',//位置
    modalHidden: true,//游戏结束后才会出现弹出框
    timer: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //最高分
    var maxscore = wx.getStorageSync('maxscore');
    if (!maxscore) maxscore = 0;
    this.setData({
      maxscore: maxscore
    });
    //开始初始化数据
    this.initGround(this.data.rows, this.data.cols);//初始化操场
    this.initsnake(3);//初始化蛇
    this.createfood();//初始化食物
    this.move();//初始化移动
  },
  //记分器
  storeScore: function () {
    if (this.data.maxscore < this.data.score) {
      this.setData({
        maxscore: this.data.score
      });
      wx.setStorageSync('maxscore', this.data.maxscore);
    }
  },
  //操场
  initGround: function (rows, cols) {
    for (var i = 0; i < rows; i++) {
      var arr = [];
      this.data.ground.push(arr);
      for (var j = 0; j < cols; j++) {
        this.data.ground[i].push(0);
      }
    }
  },
  //蛇
  initsnake: function (len) {
    for (var i = 0; i < len; i++) {
      this.data.ground[0][i] = 1;
      //蛇的长度就是所走过的操场的长度，因此以二维数组的方式来获取蛇的长度
      this.data.snake.push([0, i]);
    }
  },
  //移动
  move: function () {
    var that = this;
    this.data.timer = setInterval(function () {
      that.changeDirection(that.data.direction);
      that.setData({
        ground: that.data.ground
      });
    }, 400);
  },
  //开始触动
  tapstart: function (event) {
    this.setData({
      startx: event.touches[0].pageX,
      starty: event.touches[0].pageY
    })
  },
  //开始移动
  tapmove: function (event) {
    this.setData({
      endx: event.touches[0].pageX,
      endy: event.touches[0].pageY
    })
  },
  //触摸结束
  tapend: function (event) {
    var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
    var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;
    if (Math.abs(heng) > 5 || Math.abs(shu) > 5) {
      var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng) : this.computeDir(0, shu);
      switch (direction) {
        case 'left':
          if (this.data.direction == 'right') return;
          break;
        case 'right':
          if (this.data.direction == 'left') return;
          break;
        case 'top':
          if (this.data.direction == 'top') return;
          break;
        case 'bottom':
          if (this.data.direction == 'bottom') return;
          break;
        default:
      }
      this.setData({
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0,
        direction: direction
      })
    }
  },
  //电脑中蛇蛇的此时位置
  computeDir: function (heng, num) {
    if (heng) return (num > 0) ? 'right' : 'left';
    return (num > 0) ? 'bottom' : 'top';
  },
  //食物
  createfood: function () {
    var x = Math.floor(Math.random() * this.data.rows);
    var y = Math.floor(Math.random() * this.data.cols);
    var ground = this.data.ground;
    ground[x, y] = 2;
    this.setData({
      ground: ground,
      food: [x, y]
    });
  },
  changeDirection: function (dir) {
    switch (dir) {
      case 'left':
        return this.changeLeft();
        break;
      case 'right':
        return this.changeRight();
        break;
      case 'top':
        return this.changeTop();
        break;
      case 'bottom':
        return this.changeBottom();
        break;
      default:
    }
  },
  changeLeft: function () {

    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1][1];
    var snakeTAIL = arr[0];
    var ground = this.data.ground;
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0;
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1];
    };

    var x = arr[len - 1][0];
    var y = arr[len - 1][1] - 1;
    arr[len - 1] = [x, y];
    this.checkGame(snakeTAIL);
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1;
    }

    this.setData({
      ground: ground,
      snake: arr
    });

    return true;
  },
  changeRight: function () {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1][1];
    var snakeTAIL = arr[0];
    var ground = this.data.ground;
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0;
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1];
    };

    var x = arr[len - 1][0];
    var y = arr[len - 1][1] + 1;
    arr[len - 1] = [x, y];
    this.checkGame(snakeTAIL);
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1;

    }

    this.setData({
      ground: ground,
      snake: arr
    });
    return true;
  },
  changeTop: function () {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1][1];
    var snakeTAIL = arr[0];
    var ground = this.data.ground;
    ground[snakeTAIL[0]][snakeTAIL[1]] = 0;
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1];
    };

    var x = arr[len - 1][0] - 1;
    var y = arr[len - 1][1];
    arr[len - 1] = [x, y];
    this.checkGame(snakeTAIL);
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1;
    }
    this.setData({
      ground: ground,
      snake: arr
    });

    return true;
  },
  changeBottom: function () {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1];
    var snakeTAIL = arr[0];
    var ground = this.data.ground;

    ground[snakeTAIL[0]][snakeTAIL[1]] = 0;
    for (var i = 0; i < len - 1; i++) {
      arr[i] = arr[i + 1];
    };
    var x = arr[len - 1][0] + 1;
    var y = arr[len - 1][1];
    arr[len - 1] = [x, y];
    this.checkGame(snakeTAIL);
    for (var i = 1; i < len; i++) {
      ground[arr[i][0]][arr[i][1]] = 1;
    }
    this.setData({
      ground: ground,
      snake: arr
    });
    return true;
  },
  checkGame: function (snakeTAIL) {
    var arr = this.data.snake;
    var len = this.data.snake.length;
    var snakeHEAD = arr[len - 1];
    if (snakeHEAD[0] < 0 || snakeHEAD[0] >= this.data.rows || snakeHEAD[1] >= this.data.cols || snakeHEAD[1] < 0) {
      clearInterval(this.data.timer);
      this.setData({
        modalHidden: false,
      })
    }
    for (var i = 0; i < len - 1; i++) {
      if (arr[i][0] == snakeHEAD[0] && arr[i][1] == snakeHEAD[1]) {
        clearInterval(this.data.timer);
        this.setData({
          modalHidden: false,
        })
      }
    }
    if (snakeHEAD[0] == this.data.food[0] && snakeHEAD[1] == this.data.food[1]) {
      arr.unshift(snakeTAIL);
      this.setData({
        score: this.data.score + 10
      });
      this.storeScore();
      this.creatFood();
    }


  },
  modalChange: function () {
    this.setData({
      score: 0,
      ground: [],
      snake: [],
      food: [],
      modalHidden: true,
      direction: ''
    });
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})