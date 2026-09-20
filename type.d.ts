// {
//   "id": 15,
//     "userName": "arthur",
//       "comment": "winning",
//         "createdAt": "2026-09-19T14:31:10.771Z"
// }

interface Likes {
  id: number;
  userName: string;
  comment: string;
  createdAt: string;
}

interface EachNominee {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  menufestus: string;
}

interface Nominee {
id: number;
firstName: string;
lastName: string;
description: string;
menufestus: string;
user: {
  id: number;
  email: string;
  password: string;
  createdAt: string;
},
likes: [],
createdAt: string
}

interface Like {

}

interface Login {
  id: string;
  userName: string;
  password: string;
  nominees: EachNominee[];
  key: {};
  history: [];
  createdAt: string;
}

interface addNominee {
  message: string;
  state: boolean;
}

interface addLike {
  message: string;
  state: boolean;
}