<?php
declare(strict_types=1);

// Obsidian SDK utility: result_headers

class ObsidianResultHeaders
{
    public static function call(ObsidianContext $ctx): ?ObsidianResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
