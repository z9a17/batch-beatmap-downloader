using System.Text.Json;
using osu.Game.Beatmaps;
using Realms;

const int protocolVersion = 1;

static void WriteJson<T>(T value, TextWriter writer)
{
    writer.Write(JsonSerializer.Serialize(value, new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    }));
}

if (args.Length == 1 && args[0] == "--self-test")
{
    var selfTestPath = Path.Combine(Path.GetTempPath(), $"bbd-lazer-reader-{Guid.NewGuid():N}.realm");
    try
    {
        using var selfTestRealm = Realm.GetInstance(new RealmConfiguration(selfTestPath));
        WriteJson(new { protocolVersion, realmAvailable = true }, Console.Out);
        return 0;
    }
    catch (Exception exception)
    {
        WriteJson(new
        {
            protocolVersion,
            realmAvailable = false,
            error = exception.Message,
        }, Console.Error);
        return 5;
    }
    finally
    {
        try
        {
            Realm.DeleteRealm(new RealmConfiguration(selfTestPath));
        }
        catch
        {
            // The self-test result above already reports initialization failures.
        }
    }
}

if (args.Length == 1 && args[0] == "--version")
{
    WriteJson(new { protocolVersion }, Console.Out);
    return 0;
}

if (args.Length != 1)
{
    WriteJson(new
    {
        protocolVersion,
        error = "Expected the path to osu!lazer's client.realm file.",
    }, Console.Error);
    return 2;
}

var realmPath = Path.GetFullPath(args[0]);
if (!File.Exists(realmPath))
{
    WriteJson(new
    {
        protocolVersion,
        error = $"Realm database does not exist: {realmPath}",
    }, Console.Error);
    return 3;
}

try
{
    var configuration = new RealmConfiguration(realmPath)
    {
        IsReadOnly = true,
        SchemaVersion = 51,
    };

    using var realm = Realm.GetInstance(configuration);
    var onlineIds = realm
        .All<BeatmapSetInfo>()
        .AsEnumerable()
        .Select(beatmapSet => beatmapSet.OnlineID)
        .ToArray();

    var setIds = onlineIds
        .Where(id => id > 0)
        .Distinct()
        .Order()
        .ToArray();

    WriteJson(new
    {
        protocolVersion,
        setIds,
        ignoredLocalSets = onlineIds.Count(id => id <= 0),
    }, Console.Out);
    return 0;
}
catch (Exception exception)
{
    WriteJson(new
    {
        protocolVersion,
        error = "Could not read the osu!lazer library.",
        detail = exception.Message,
    }, Console.Error);
    return 4;
}
