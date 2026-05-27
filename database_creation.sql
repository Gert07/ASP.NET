CREATE DATABASE RecipeCollection

USE RecipeCollection

CREATE TABLE Recipes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Ingredients NVARCHAR(MAX) NOT NULL,
    Instructions NVARCHAR(MAX) NOT NULL,
    MakingTimeMinutes INT,
    CreatedAt DATETIME DEFAULT GETDATE()
);

INSERT INTO RECIPES (Title, Description, Ingredients, Instructions, MakingTimeMinutes, CreatedAt)
VALUES
('Classic Pancakes', 'Fluffy breakfast pancakes.', 'Flour, Milk, Eggs, Sugar', 'Mix ingredients. Cook on skillet.', 15, GETDATE())
