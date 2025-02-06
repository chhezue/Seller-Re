// 유저 생성
if (!Users.findOne()) {
    for (let i = 0; i < 50; i++) {
        const yearBirth = rangeArray(1950, 2003).random();
        Accounts.createUser({
            username: names[i],
            password: "password",
            email: "user" + i + "@email.com",
            profile: {
                isActive: true,
                budget: budgets.random(), // Random budget
                yearBirth: yearBirth,
                age: getAgeGroup(yearBirth),
                gender: ["여성", "남성"].random(),
                mbti: mbtis.random(),
                preferGender: genders.random(),
                preferAges: ages.random(1, 3).map((a) => a),
                imageUrl: profileImgs.random(),
            },
        });
    }
}