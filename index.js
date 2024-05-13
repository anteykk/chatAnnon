let express = require(`express`);
let mongoose = require(`mongoose`);
// let keys = require(`./keys/keys.dev`);
let keys = require(`./keys/keys.dev`); // Ключи
let Register = require(`./routers/register`); // Регистрация
let handlebars = require(`express-handlebars`);
let Auth = require(`./routers/auth`); // Авторизация
let flash = require(`connect-flash`);
let session = require(`express-session`);
let Index = require(`./routers/index`); // Главная
let Logout = require(`./routers/logout`); // Выход из сессии
let Admin = require(`./routers/adminka`); // Админка добавления пользователей
let CreateChat = require(`./routers/createch`); // Создание чата
let csrf = require(`csurf`);
let Protect = require(`./middleware/protect`); // Загрузка csrf кода
let Load = require(`./routers/loadCh`); // Подгрузка чатов на страницу
let Delete = require(`./routers/delete`); // Удаления чата
let Chat = require(`./routers/chat`); // Чат пользователя
let Leave = require(`./routers/leave`); // Запрос на выход из чата
let User = require(`./models/user`); // Модель пользователя
let Chats = require(`./models/chats`); // Модель чатов
let Time = require(`./public/time`); // Текущее время
let LoadM = require(`./routers/loadM`); // Подгрузка сообщения при скроле чата вверх
let compression = require(`compression`); // Модуль для сжатия картинок
let helmet = require(`helmet`); // Модуль для защиты хедеров
let xss = require('xss-clean'); // защищает от межсайтового скриптинга (XSS-уязвимостей)
let hpp = require('hpp'); // препятствует обходу проверок ввода и DoS-атакам с помощью ошибки Uncaught TypeError в асинхронном коде, приводящей к сбою сервера.
let mongoSanitize = require('express-mongo-sanitize'); // препятствует внедрение в MongoDB вредоносного оператора
let Error = require(`./routers/404`);
const { SocketAddress } = require('net');








let app = express();

let PORT = process.env.PORT || 3001;

let http = require(`http`).Server(app);
let io = require(`socket.io`)(http);

let MongoStore = require(`connect-mongodb-session`)(session);
let store = new MongoStore({
  collection: `sessions`,
  uri: keys.mongoURL
})
let hbs = handlebars.create({
  defaultLayout: `main`,
  extname: `hbs`,
  helpers: require(`./utils/helper`)
})

// Настройки сервера
app.engine(`hbs`, hbs.engine);
app.set(`view engine`, `hbs`);
app.set(`views`, `views`);
app.use(express.static(`public`));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
/*
app.use(session({
  secret: keys.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { // Автоудаления сессии через 1 час
    maxAge: 3600000,
    sameSite: "strict",
    secure: false,
    httpOnly: true
  },
  store: store
}))
*/

const sessionMiddleware = session({  
  secret: keys.secret,
  resave: true,
  saveUninitialized: true,
  cookie: { // Автоудаления сессии через 1 час
    maxAge: 3600000,
    sameSite: "strict",
    secure: false,
    httpOnly: true
  },  
  store: store
});
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);




  


  
  
  




//! Сокеты для передачи данных
io.on(`connection`, async function (socket){

  

  /*
  setInterval(() => {
    socket.emit("hello", { message: "Hello from server!" });
  }, 5000);
  */

  let check;
  // Проверка есть ли у пользователя сессия
   if(socket.request.session.user !== undefined){
     check = await User.findOne({_id: String(socket.request.session.user._id)});
   }

   

   if(check){

   

     
 
    

     //! Подключения пользователя к комнате чата
     socket.on(`join`, function(infa){
      console.log(`ПОЛЬЗОВАТЕЛЬ ЗАШЕЛ В КОМНАТУ ЧАТА`)
      socket.join(infa.room);
     })

     //! Новое сообщения
     socket.on(`message`, async (infa)=>{

    
      
      //! Проверка на то что в сообщении не ноль символов
      if(infa.message.length !== 0){


    // Rate limiter

    // Если не перрвый раз зашол то сравниваю время
    if(check.timeSend){
      // Если время задержки прошло то устанавливаю новое время и иду далее
      if(check.timeSend < Date.now()){

        console.log(`Проверка пройдена`);
        let t = new Date();
        t.setSeconds(t.getSeconds() + 1);
        check.timeSend = t;
        await check.save();


        let thisChat = await Chats.findOne({_id: infa.room});
        thisChat.mesSum = thisChat.mesSum + 1;
        thisChat.messages.push({
        create: Time(),
        name: socket.request.session.user.login,
        message: infa.message
        })

        await thisChat.save();


        //! Отправка сообщения всем пользователям в комнате

        socket.emit(`test`, {
          text: `Привет мир`
        })
        
        
        io.to(infa.room).emit(`newMessage`, {
          message: {
          create: Time(),
          name: socket.request.session.user.login,
          message: infa.message           
          }
        })

        

      } else { // Если время задержки еще не прошло
        console.log(`Еще не прошло 1 секунд`);
      }
    } else { // Если пользователь первый раз зашол то устанавливаю время
      let t = new Date();
      t.setSeconds(t.getSeconds() + 1);
      check.timeSend = t;
      await check.save();
    }
     
    // End rate limiter        


          
      }
       
     })
     
   }




})



app.use(compression());
app.use(flash());
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(csrf());
app.use(Protect);
app.use(xss());
app.use(hpp());
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);




// Роуты
app.use(`/`, Index);
app.use(`/register`, Register);
app.use(`/auth`, Auth);
app.use(`/logout`, Logout);
app.use(`/adminka`, Admin);
app.use(`/createchat`, CreateChat);
app.use(`/load`, Load);
app.use(`/delete`, Delete);
app.use(`/chat`, Chat);
app.use(`/leave`, Leave);
app.use(`/loadM`, LoadM);
app.use(Error);



//! Комнаты Socket IO





//! Подключения базы данных и запуск сервера
let startDB = async ()=>{
  await mongoose.connect(keys.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>{
    console.log(`База данных подключена.`);
  })

  http.listen(PORT, ()=>{
    console.log(`Сервер запущен.`);
  })
}

startDB();