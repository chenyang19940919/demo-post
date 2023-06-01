import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = axios
          .post(process.env.APIServer + "/api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          })
          .then((res) => res.data);

        if (user) {
          return user;
        }

        // const user = await prismadb.user.findUnique({
        //   where: {
        //     email: credentials.email,
        //   },
        // });

        // if (!user || !user.hashedPassword) {
        //   throw new Error("Email does not exist");
        // }

        // const isCorrectPassword = await compare(
        //   credentials.password,
        //   user.hashedPassword
        // );

        // if (!isCorrectPassword) {
        //   throw new Error("Incorrect password");
        // }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// export const authOptions = {
//   session: {
//     jwt: true,
//   },
//   pages: {
//     signIn: "/login",
//     signOut: "/login",
//   },
//   providers: [
//     Credentials({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },
//       async authorize(credentials) {
//         const res = await fetch("http://localhost:8000/api/auth/login", {
//           method: "POST",
//           body: JSON.stringify(credentials),
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         const user = await res.json();

//         if (res.ok && user) {
//           return user;
//         }

//         return null;
//       },
//     }),
//   ],
//   // callback
//   callbacks: {
//     async session({ session, user, token }) {
//       session.accessToken = token.accessToken;
//       session.user.role = token.role;
//       return session;
//     },
//     async jwt({ token, user, account, profile, isNewUser }) {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
// };

// export default NextAuth(authOptions);
